const Joi = require('joi');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const config = require('../../config/backend');
const { BadRequestError, NotFoundError } = require('../../commons/errors');
const { RES_STATUS_OK, RES_MESSAGE_SUCCESS } = require('../../commons/constants');
const { encodeFolder } = require('../../utils/security');
const service = require('../services/contents');
const { exists } = require('../../utils/filesytem');

/* Contents methods */
async function fetchAll (ctx) {
  const schema = Joi.object({
    offset: Joi.number().integer(),
    limit: Joi.number().integer().max(100),
    sort: Joi.string().allow('date', 'title'),
    sort_dir: Joi.string().allow('asc', 'desc').uppercase(),
    is_focus: Joi.boolean(),
    is_pin: Joi.boolean(),
    type: Joi.number().integer(),
    search: Joi.string().trim().min(2).max(20).allow(null, ''),
    tag: Joi.number().integer(),
  });

  const { error, value } = schema.validate({
    offset: ctx.query.offset ?? 0,
    limit: ctx.query.limit ?? 100,
    sort: ctx.query.sort ?? 'date',
    sort_dir: ctx.query.sort_dir ?? 'desc',
    is_focus: ctx.query.is_focus ?? false,
    is_pin: ctx.query.is_pin ?? false,
    type: ctx.query.type ?? -1,
    search: ctx.query.search ?? null,
    tag: ctx.query.tag ?? -1,
  });

  if (error) throw new BadRequestError(error);

  const res = await service.fetchAll(value);

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    total: res.total,
    data: res.rows,
  });
}

async function fetch (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

async function create (ctx) {
  const res = await service.create();

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

async function update (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    status: Joi.number().required(),
    type: Joi.number().required(),
    title: Joi.string().trim().required().max(200),
    summary: Joi.string().trim().max(5000).allow(null, ''),
    cover: Joi.string().trim().max(200).allow(null, ''),
    password: Joi.string().trim().max(20).allow(null, ''),
    is_focus: Joi.boolean().allow(null),
    is_pin: Joi.boolean().allow(null),
    body: Joi.object().allow(null, {}),
    items: Joi.object().allow(null, {}),
  });

  ctx.body = ctx.request.body;

  const { error, value } = schema.validate({
    id: ctx.params.id,
    status: ctx.body.status,
    type: ctx.body.type,
    title: ctx.body.title,
    summary: ctx.body.summary,
    cover: ctx.body.cover,
    password: ctx.body.password,
    is_focus: ctx.body.is_focus ?? false,
    is_pin: ctx.body.is_pin ?? false,
    body: ctx.body.body,
    items: ctx.body.items,
  });

  if (error) throw new BadRequestError(error);

  const res = await service.update(value);

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

async function remove (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  // Remove files
  const encodedId = encodeFolder(res.id);
  const target = path.join(__dirname, config.upload.path.replace('{id}', encodedId));

  try {
    await fs.rm(target, { recursive: true });
    console.log(`Folder deleted: ${target}`);
  } catch (e) {
    console.error(e.message);
  }

  // Remove relations
  await service.removeRelationsByContent(value);

  // Remove/update tags
  await service.removeTagsFromContent(value);

  const res2 = await service.remove(value);

  ctx.status = 204;
}

async function fetchTypes (ctx) {
  const schema = Joi.object({
    search: Joi.string().trim().min(2).max(20).allow(null, ''),
    tag: Joi.number().integer(),
  });

  const { error, value } = schema.validate({
    search: ctx.query.search ?? null,
    tag: ctx.query.tag ?? -1,
  });

  if (error) throw new BadRequestError(error);

  const res = [
    { type: -1, title: 'Tout', ...await service.countType(value, -1) },
    { type: 0, title: 'Statique', ...await service.countType(value, 0) },
    { type: 1, title: 'Article', ...await service.countType(value, 1) },
    { type: 2, title: 'Collection', ...await service.countType(value, 2) },
    { type: 3, title: 'Image', ...await service.countType(value, 3) },
    { type: 4, title: 'Musique', ...await service.countType(value, 4) },
    { type: 5, title: 'Vidéo', ...await service.countType(value, 5) },
  ];

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

/* Files methods */
async function createFiles (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    generate_elements: Joi.boolean(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    generate_elements: ctx.request.body.generate_elements,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  // Initialize items property
  const encodedId = encodeFolder(value.id);

  res.items = res.items ?? {};
  res.items.folder = encodedId;
  res.items.files = res.items.files ?? [];
  res.items.metadata = res.items.metadata ?? [];
  res.items.elements = res.items.elements ?? [];

  // Upload files
  const folder = config.upload.path.replace('{id}', encodedId);

  try {
    await fs.mkdir(path.join(__dirname, folder));
  } catch (e) { }

  if (!Array.isArray(ctx.request.files.upload))
    ctx.request.files.upload = [ctx.request.files.upload];

  for (let file of ctx.request.files.upload) {
    try {
      const target = path.join(__dirname, folder + file.name);

      if (await exists(target)) continue;

      await fs.copyFile(file.path, target);
      await fs.unlink(file.path);

      res.items.files.push({
        id: uuidv4(),
        name: file.name,
        type: file.type,
        size: file.size,
      });

      console.log('File uploaded: %s moved to %s', file.name, target);
    } catch (e) {
      console.error(e);
    }
  }

  // Generate elements
  if (value.generate_elements) {
    for (let file of ctx.request.files.upload) {
      let item = {
        id: uuidv4(),
        is_active: true,
        cover: file.name,
        title: _cleanFilename(file.name),
        body: null,
        url: null,
        typed_metadata: _initializeTypedMetadata(),
        customized_metadata: res.items.metadata,
      };

      res.items.elements.push(item);
    }
  }

  // Update content
  const res2 = await service.update(res);

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res2
  });
}

async function removeFiles (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    fid: Joi.string().trim().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    fid: ctx.params.fid,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  // Delete file only
  res.items = res.items ?? [];
  res.items.files = res.items.files ?? [];

  const file = res.items.files.find((file) => file.id === value.fid);

  if (file) {
    const encodedId = encodeFolder(value.id);
    const target = path.join(__dirname, config.upload.path.replace('{id}', encodedId) + file.name);

    try {
      await fs.unlink(target);
      console.log(`File deleted: ${target}`);
    } catch (e) {
      console.error(e.message);
    }

    res.items.files = res.items.files.filter((file) => file.id !== value.fid);
  }

  // Update content
  await service.update(res);

  ctx.status = 204;
}

/* Relations methods */
async function fetchRelations (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  const res2 = await service.fetchRelations(value);

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res2
  });
}

async function createRelations (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    relation_id: Joi.number().required(),
    position: Joi.number().required(),
    status: Joi.number().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    relation_id: ctx.request.body.relation_id,
    position: ctx.request.body.position,
    status: ctx.request.body.status,
  });

  if (error) throw new BadRequestError(error);
  if (value.id === value.relation_id) throw new BadRequestError('The content can not be linked to itself.');

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  const res2 = await service.createRelations(value);

  // Create the reverse link
  const value2 = {
    id: value.relation_id,
    relation_id: value.id,
    position: value.position,
    status: value.status,
  };

  await service.createRelations(value2);

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res2
  });
}

async function updateRelations (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    rid: Joi.string().required(),
    position: Joi.number().required(),
    status: Joi.number().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    rid: ctx.params.rid,
    position: ctx.request.body.position,
    status: ctx.request.body.status,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  const res2 = await service.updateRelations(value);

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res2
  });
}

async function removeRelations (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    rid: Joi.string().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    rid: ctx.params.rid,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  await service.removeRelations(value);

  // Remove the reverse link
  const value2 = {
    id: value.rid,
    rid: value.id,
  };

  await service.removeRelations(value2);

  ctx.status = 204;
}

/* Tags methods */
async function fetchTags (ctx) {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  const res2 = await service.fetchTags(value);

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res2
  });
}

async function createTags (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    label: Joi.string().lowercase().trim().min(2).max(20).required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    label: ctx.request.body.label,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  // Check if tag exists
  let tag = await service.fetchTagByLabel(value.label);

  if (tag) {
    let tagContent = await service.fetchTagByContent(value.id, tag.id);

    if (!tagContent) {
      await service.createTagByContent(value.id, tag.id);
      tag.total++;
      await service.updateTags({ tid: tag.id, label: tag.label, total: tag.total });
    }
  } else {
    tag = await service.createTags(value);
    tagContent = await service.createTagByContent(value.id, tag.id);
  }

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: tag
  });
}

async function updateTags (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    tid: Joi.number().required(),
    label: Joi.string().lowercase().trim().max(20).required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    tid: ctx.params.tid,
    label: ctx.request.body.label,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  // Check if tag exists
  const tag = await service.fetchTagById(value.tid);
  if (!tag) throw new NotFoundError();

  const res2 = await service.updateTags({ tid: tag.id, label: value.label, total: tag.total });

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res2
  });
}

async function removeTags (ctx) {
  // Check parameters
  const schema = Joi.object({
    id: Joi.number().required(),
    tid: Joi.string().trim().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
    tid: ctx.params.tid,
  });

  if (error) throw new BadRequestError(error);

  // Check if content exists
  const res = await service.fetch(value);
  if (!res) throw new NotFoundError();

  // Check if tag exists
  const tag = await service.fetchTagById(value.tid);

  if (tag) {
    tag.total--;
    await service.updateTags({ tid: tag.id, label: tag.label, total: tag.total });

    if (tag.total <= 0)
      await service.removeTags(value);
  }

  await service.removeTagFromContent(value.id, value.tid);

  ctx.status = 204;
}

/* Private methods */

function _initializeTypedMetadata () {
  return [
    {
      id: uuidv4(),
      key: 'author',
      label: 'Auteur',
      type: 'string',
      default: 'N/A',
      value: null,
    },
    {
      id: uuidv4(),
      key: 'duration',
      label: 'Durée',
      type: 'string',
      default: '0:00',
      value: null,
    },
  ];
}

function _cleanFilename (filename) {
  filename = filename.replace(/[^0-9a-z]/ig, ' ');
  const words = filename.split(' ');
  words.pop();
  return words.join(' ');
}

module.exports = {
  fetchAll, fetch, create, update, remove, fetchTypes,
  createFiles, removeFiles,
  fetchRelations, createRelations, updateRelations, removeRelations,
  fetchTags, createTags, updateTags, removeTags,
};

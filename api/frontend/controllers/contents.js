const Joi = require('joi');

const { BadRequestError, NotFoundError } = require('../../commons/errors');
const { RES_STATUS_OK, RES_MESSAGE_SUCCESS } = require('../../commons/constants');
const service = require('../services/contents');

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
  const schema = Joi.object({
    id: Joi.number(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
  });

  if (error) throw new BadRequestError(error);

  const res = await service.fetch(value);

  if (!res) throw new NotFoundError();

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

async function fetchRelations (ctx) {
  const schema = Joi.object({
    id: Joi.number(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id ?? null,
  });

  if (error) throw new BadRequestError(error);

  const res = await service.fetchRelations(value);

  if (!res) throw new NotFoundError();

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

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

module.exports = {
  fetchAll, fetch,
  fetchRelations,
  fetchTags,
  fetchTypes,
};

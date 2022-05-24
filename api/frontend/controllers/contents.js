const Joi = require('joi');

const { BadRequestError, NotFoundError } = require('../../commons/errors');
const { RES_STATUS_OK, RES_MESSAGE_SUCCESS } = require('../../commons/constants');
const service = require('../services/contents');

async function fetchAll (ctx) {
  const schema = Joi.object({
    type: Joi.number().integer(),
    offset: Joi.number().integer(),
    limit: Joi.number().integer().max(100),
    sort: Joi.string().allow('date', 'title'),
    sort_dir: Joi.string().allow('asc', 'desc').uppercase(),
    is_focus: Joi.boolean(),
    is_pin: Joi.boolean(),
  });

  const { error, value } = schema.validate({
    type: null ?? ctx.query.type,
    offset: ctx.query.offset ?? 0,
    limit: ctx.query.limit ?? 100,
    sort: ctx.query.sort ?? 'date',
    sort_dir: ctx.query.sort_dir ?? 'desc',
    is_focus: ctx.query.is_focus ?? false,
    is_pin: ctx.query.is_pin ?? false,
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

// @todo: SQL query
async function fetchTypes (ctx) {
  const res = [
    { type: 'article', title: 'Article', count: 23 },
    { type: 'data', title: 'Collection', count: 2 },
    { type: 'picture', title: 'Image', count: 6 },
    { type: 'audio', title: 'Musique', count: 4 },
    { type: 'static', title: 'Statique', count: 2 },
    { type: 'video', title: 'Vidéo', count: 3 },
  ];

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

module.exports = {
  fetchAll,
  fetch,
  fetchRelations,
  fetchTypes,
};

const Joi = require('joi');

const { BadRequestError, NotFoundError } = require('../../commons/errors');
const { RES_STATUS_OK, RES_MESSAGE_SUCCESS } = require('../../commons/constants');
const { getType } = require('../../commons/helpers');
const service = require('../services/contents');

async function fetchAll (ctx) {
  const schema = Joi.object({
    type: Joi.number().integer(),
    offset: Joi.number().integer(),
    limit: Joi.number().integer().max(20),
    sort: Joi.string().allow('date', 'title'),
    sort_dir: Joi.string().allow('asc', 'desc').uppercase()
  });

  const { error, value } = schema.validate({
    type: null ?? ctx.query.type,
    offset: ctx.query.offset ?? 0,
    limit: ctx.query.limit ?? 10,
    sort: ctx.query.sort ?? 'date',
    sort_dir: ctx.query.sort_dir ?? 'desc',
  });

  if (error) throw new BadRequestError(error);

  const res = await service.fetchAll(value);

  res.map((item) => item.type = getType(item.type));

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
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

  res.map((item) => item.type = getType(item.type));

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

module.exports = {
  fetchAll,
  fetch,
  fetchRelations
};

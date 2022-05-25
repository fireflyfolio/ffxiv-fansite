const Joi = require('joi');
const jwt = require('jsonwebtoken');

const configBackend = require('../../config/backend');
const { BadRequestError, NotFoundError, TokenExpiredError } = require('../../commons/errors');
const service = require('../services/users');
const security = require('../../utils/security');

async function signin (ctx) {
  // Check parameters
  const schema = Joi.object({
    username: Joi.string().trim().min(4).max(50).required(),
    password: Joi.string().trim().min(4).max(200).required(),
  });

  const { error, value } = schema.validate({
    username: ctx.request.body.username,
    password: security.encodeHash(ctx.request.body.password),
  });

  if (error) throw new BadRequestError(error);

  // Check if user exists
  const user = await service.fetch(value);
  if (!user) throw new NotFoundError();

  // Generate new tokens
  const data = {
    accessToken: security.getJWT(user, configBackend.security.jwt.expiresIn.accessToken),
    refreshToken: security.getJWT(user, configBackend.security.jwt.expiresIn.refreshToken)
  };

  ctx.ok({ data });
}

async function refresh (ctx) {
  // Check parameters
  const schema = Joi.object({
    refreshToken: Joi.string().trim().required(),
  });

  const { error, value } = schema.validate({
    refreshToken: ctx.request.body.refreshToken,
  });

  if (error) throw new BadRequestError(error);

  // Verify refresh token expiration
  try {
    jwt.verify(value.refreshToken, configBackend.security.jwt.secret);
  } catch (e) {
    throw new TokenExpiredError(e);
  }

  // Check if user exists
  const decoded = jwt.decode(value.refreshToken);
  const user = await service.fetchById(decoded.id);
  if (!user) throw new NotFoundError();

  // Generate new tokens
  const data = {
    accessToken: security.getJWT(user, configBackend.security.jwt.expiresIn.accessToken),
    refreshToken: security.getJWT(user, configBackend.security.jwt.expiresIn.refreshToken)
  };

  ctx.ok({ data });
}

module.exports = {
  signin, refresh,
};

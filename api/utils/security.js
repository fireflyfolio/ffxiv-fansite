const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const configBackend = require('../config/backend');

function getJWT (data, expiresIn) {
  return jwt.sign(data, configBackend.security.jwt.secret, {
    expiresIn: expiresIn,
    algorithm: configBackend.security.jwt.algorithm
  });
}

function encodeHash (hash, algorithm = configBackend.crypto.algorithm, secret = configBackend.crypto.secret) {
  return crypto.createHmac(algorithm, secret)
    .update(hash.toString())
    .digest('hex');
}

function encodeFolder (hash) {
  return encodeHash(hash, configBackend.upload.algorithm);
}

module.exports = {
  getJWT,
  encodeHash,
  encodeFolder,
}

const { RES_STATUS_OK, RES_MESSAGE_SUCCESS } = require('../../commons/constants');
const service = require('../services/tags');

async function fetchAll (ctx) {
  const res = await service.fetchAll();

  ctx.ok({
    status: RES_STATUS_OK,
    message: RES_MESSAGE_SUCCESS,
    data: res
  });
}

module.exports = {
  fetchAll
};

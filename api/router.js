const { Pool } = require('pg');
const jwt = require('koa-jwt');

const config = require('./config');
const configBackend = require('./config/backend');

module.exports = (router) => {
  router.prefix('/v1');

  // Status route
  router.get('/status', async (ctx) => {
    const pool = new Pool();

    const data = {
      appName: config.server.appName,
      appVersion: config.server.appVersion,
      pgPool: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    };

    await pool.end();

    ctx.ok({ data });
  });

  // Frontend routes
  router.use('/contents', require('./frontend/routes/contents'));
  router.use('/tags', require('./frontend/routes/tags'));

  // Backend routes
  router.use('/backend/auth', require('./backend/routes/auth'));

  // Protected routes
  router.use(jwt({ secret: configBackend.security.jwt.secret }));
  router.use('/backend/contents', require('./backend/routes/contents'));
}

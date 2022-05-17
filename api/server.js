const { types } = require('pg');
const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const Cors = require('@koa/cors');
const KoaBody = require('koa-body');
const BodyParser = require('koa-bodyparser');
const Helmet = require('koa-helmet');
const Respond = require('koa-respond');
const Static = require('koa-static');

const config = require('./config');
const { RES_STATUS_KO } = require('./commons/constants');

types.setTypeParser(20, parseInt);

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (401 == e.status) {
      ctx.status = 401;
      ctx.type = 'json';
      ctx.body = {
        status: RES_STATUS_KO,
        message: 'Protected resource, use Authorization header to get access',
        errors: null,
      };
    } else {
      ctx.status = (e.meta && e.meta.code) ?? 500;
      ctx.type = 'json';
      ctx.body = {
        status: (e.meta && e.meta.status) ?? RES_STATUS_KO,
        message: (e.meta && e.meta.message) ?? 'Internal Server Error',
        errors: (e.meta && e.meta.errors) ?? null,
      };
    }

    ctx.app.emit('error', e, ctx);
  }
});

app.use(Helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(Logger((str, args) => {
    const now = new Date();
    console.log(`[${now.toISOString()}]`, str);
  }));
}

app.use(Cors());
app.use(KoaBody({ multipart: true }));
app.use(BodyParser());

app.use(Respond());
app.use(Static(config.static.root));

// API routes
require('./router')(router);
app.use(router.routes())
app.use(router.allowedMethods());

module.exports = app;

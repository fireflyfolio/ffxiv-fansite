module.exports = {
  server: {
    port: process.env.PORT || 3000,
    appName: 'FireflyFolio API',
    appVersion: '1.0.0',
  },
  db: {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || 'lbfamily_api',
    database: process.env.PG_DATABASE || 'lbfamily',
    password: process.env.PG_PASSWORD || 'api',
  },
  static: {
    root: 'public'
  }
};

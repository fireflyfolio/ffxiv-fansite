module.exports = {
  crypto: {
    algorithm: 'sha512',
    secret: '2ed1fff2-e54c-48ce-b55f-8bcdfa507d36',
  },
  security: {
    jwt: {
      secret: '9e3a0d4b-ce7e-4c4d-b44e-917c07d09692',
      expiresIn: {
        accessToken: 1800,
        refreshToken: 3600,
      },
      algorithm: 'HS512'
    },
    cors: {
      origin: process.env.CORS_HOST || 'localhost'
    }
  },
  upload: {
    algorithm: 'sha256',
    path: '../../public/static/contents/{id}/'
  },
};

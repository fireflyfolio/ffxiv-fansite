class DomainError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends DomainError {
  constructor() {
    super(null);

    this.meta = {
      code: 404,
      status: 'NOT_FOUND',
      message: 'Not Found',
      errors: null,
    }
  }
}

class BadRequestError extends DomainError {
  constructor(error) {
    super(error.message);

    this.meta = {
      code: 400,
      status: 'BAD_REQUEST',
      message: 'Bad Request',
      errors: [(typeof error === 'string' ? error : error.message)],
    }
  }
}

class TokenExpiredError extends DomainError {
  constructor(error) {
    super(error.message);

    this.meta = {
      code: 403,
      status: 'FORBIDDEN',
      message: 'Token Expired Error',
      errors: [(typeof error === 'string' ? error : error.message)],
    }
  }
}

module.exports = {
  DomainError,
  NotFoundError,
  BadRequestError,
  TokenExpiredError,
}

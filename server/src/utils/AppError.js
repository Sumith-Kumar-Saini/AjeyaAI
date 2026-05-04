class AppError extends Error {
  constructor(message, statusCode = 500, code) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; // distinguish from programming/unknown errors
    this.code = code;

    // Only necessary for extending built-in Error in some environments
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { AppError };

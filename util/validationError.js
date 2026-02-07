class ValidationError extends Error {
  constructor(message = "Validation failed", statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.name = "ValidationError";
  }
}

module.exports = ValidationError;

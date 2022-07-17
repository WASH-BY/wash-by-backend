class ErrorResponse extends Error {
  constructor(message, statuscode) {
    super(message);
    this.code = statuscode;
  }
}

module.exports = ErrorResponse;

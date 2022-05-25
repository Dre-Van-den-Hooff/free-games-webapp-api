const NOT_FOUND = "NOT_FOUND";
const VALIDATION_FAILED = "VALIDATION_FAILED";
const UNAUTHORIZED = "UNAUTHORIZED";
const FORBIDDEN = "FORBIDDEN";

export interface ServiceError {
  code: string;
  message: string;
  details: Object;
  name: string;
}

export class ServiceError extends Error {
  constructor(code: string, message: string, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ServiceError";
  }

  static notFound(message: string, details: Object) {
    return new ServiceError(NOT_FOUND, message, details);
  }

  static validationFailed(message: string, details: Object) {
    return new ServiceError(VALIDATION_FAILED, message, details);
  }

  static unauthorized(message: string, details: Object) {
    return new ServiceError(UNAUTHORIZED, message, details);
  }

  static forbidden(message: string, details: Object) {
    return new ServiceError(FORBIDDEN, message, details);
  }

  get isNotFound() {
    return this.code === NOT_FOUND;
  }

  get isValidationFailed() {
    return this.code === VALIDATION_FAILED;
  }

  get isUnauthorized() {
    return this.code === UNAUTHORIZED;
  }

  get isForbidden() {
    return this.code === FORBIDDEN;
  }
}

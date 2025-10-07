export class ValidationException extends Error {
  cause: string;
  constructor(cause: string) {
    super();
    this.name = "Validation error";
    this.cause = cause;
  }
}

export class HttpException extends Error {
  cause: string;
  status?: number;
  constructor(cause: string, status?: number) {
    super();
    this.name = "Http exception";
    this.cause = cause;
    this.status = status;
  }
}

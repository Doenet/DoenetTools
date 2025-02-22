import { StatusCodes } from "http-status-codes";

export class InvalidRequestError extends Error {
  errorCode: StatusCodes;
  constructor(message: string, errorCode = StatusCodes.BAD_REQUEST) {
    super(message);
    this.errorCode = errorCode;

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}

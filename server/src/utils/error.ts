export class InvalidRequestError extends Error {
  errorCode = 400;
  constructor(message: string) {
    super(message);
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}

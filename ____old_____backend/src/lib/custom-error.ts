
export class CustomError extends Error {
    constructor(override message: string, public statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }

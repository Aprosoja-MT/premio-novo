export abstract class ApplicationError extends Error {
  abstract statusCode: number;
  abstract code: string;
}

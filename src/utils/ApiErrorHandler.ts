export default class ApiExceptionHandler extends Error {
  statusCode: number;
  status: boolean;
  error?: any;
  isOperational: boolean;

  constructor(message: string, statusCode?: number | null, error?: any) {
    super(message);
    this.statusCode = statusCode || 400;
    this.status = false;
    this.error = error;

    this.isOperational = true;
  }
}

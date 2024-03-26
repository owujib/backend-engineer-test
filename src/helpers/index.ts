import { Schema, ValidationResult } from 'joi';
import ApiExceptionHandler from '../utils/ApiErrorHandler';

export const validateRequest = (schema: Schema, body: any) => {
  const { error, value }: ValidationResult = schema.validate(body);
  if (error) {
    throw RequestValidationError(error.details.map((error) => error.message));
  }

  return { value };
};

export function omitProperties<T, K extends keyof T>(
  obj: T,
  ...propsToOmit: K[]
): Omit<T, K> {
  const result = { ...obj };
  propsToOmit.forEach((prop) => {
    delete result[prop];
  });
  return result;
}

function RequestValidationError(payload: any) {
  return new ApiExceptionHandler('Request Validation Error', 400, payload);
}

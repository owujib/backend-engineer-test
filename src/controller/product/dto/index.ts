import Joi from 'joi';
import { PRODUCT_STATUS_ENUM } from '../../../shared/enums';

export const CreateProductDto = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
}).options({
  abortEarly: false,
});

export const UpdateProductDto = Joi.object({
  description: Joi.string().optional(),
  name: Joi.string().optional(),
  price: Joi.string().optional(),
}).options({
  abortEarly: false,
});
export const UpdateProductStatusDto = Joi.object({
  status: Joi.string()
    .required()
    .valid(PRODUCT_STATUS_ENUM.ACTIVE, PRODUCT_STATUS_ENUM.IN_ACTIVE),
}).options({
  abortEarly: false,
});

import Joi from 'joi';

export const UserAccountDto = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
}).options({
  abortEarly: false,
});
export const UserLoginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
}).options({
  abortEarly: false,
});
export const AddToCart = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
}).options({
  abortEarly: false,
});

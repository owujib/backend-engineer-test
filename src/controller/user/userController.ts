import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../../models/User';
import { omitProperties, validateRequest } from '../../helpers';
import CartItem from '../../models/CartItem';
import { AddToCart, UserAccountDto, UserLoginDto } from './dto/user.dto';
import ApiExceptionHandler from '../../utils/ApiErrorHandler';
import jwt from 'jsonwebtoken';
import Products from '../../models/Products';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { value } = validateRequest(UserAccountDto, req.body);
    const existingUser = await User.findOne({ email: value.email });

    if (existingUser) {
      return next(new ApiExceptionHandler('User already exists', 400));
    }

    const user: IUser = new User({ ...value });
    await user.save();
    res.status(201).json({
      data: {
        email: user.email,
        fullname: user.fullname,
      },
      accessToken: createSignToken({ userId: user._id }),
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const { value } = validateRequest(UserLoginDto, req.body);
    const user: IUser | null = await User.findOne({ email: value.email });
    if (!user) {
      return next(
        new ApiExceptionHandler('Invalid Credentials Please Try Again', 400),
      );
    }

    const isPasswordValid = await user.comparePassword(
      value.password,
      user.password,
    );
    if (!isPasswordValid) {
      return next(
        new ApiExceptionHandler('Invalid Credentials Please Try Again', 400),
      );
    }

    return res
      .status(200)
      .json({ accessToken: createSignToken({ userId: user._id }) });
  } catch (error) {
    return next(error);
  }
};

export const getUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (<any>req).user?._id;
    const cartItems = await CartItem.find({ user: userId }).populate({
      path: 'productId',
      select: '-updatedAt -deletedAt -status',
    });
    return res.status(200).json({ data: cartItems });
  } catch (error) {
    return next(error);
  }
};

const createSignToken = (payload: any): string => {
  const token = jwt.sign(payload, (<any>process.env).JWT_SECRET, {
    expiresIn: '5d',
  });

  return token;
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { value } = validateRequest(AddToCart, req.body);

    const product = await Products.findById(value.productId);
    if (!product) {
      return next(
        new ApiExceptionHandler('No Record Found For The Given Data', 400),
      );
    }

    let cartItem = await CartItem.findOne({
      productId: value.productId,
      userId: (<any>req).user?._id,
    });

    if (!cartItem) {
      cartItem = new CartItem({
        productId: value.productId,
        quantity: value.quantity,
        price: product.price,
        userId: (<any>req).user?._id,
      });
    } else {
      cartItem.quantity += value.quantity;
    }

    await cartItem.save();

    return res.status(200).json({
      data: {
        _id: cartItem._id,
        productId: product._id,
        quantity: cartItem.quantity,
        userId: cartItem.userId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

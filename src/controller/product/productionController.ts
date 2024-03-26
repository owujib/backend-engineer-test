import { NextFunction, Request, Response } from 'express';
import Product, { IProduct } from '../../models/Products';
import { validateRequest } from '../../helpers';
import { CreateProductDto, UpdateProductDto } from './dto';
import Products from '../../models/Products';
import ApiExceptionHandler from '../../utils/ApiErrorHandler';
import { PRODUCT_STATUS_ENUM } from '../../shared/enums';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { value } = validateRequest(CreateProductDto, req.body);
    const product: IProduct = new Product({ ...value });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products: IProduct[] = await Product.find({
      status: PRODUCT_STATUS_ENUM.ACTIVE,
    }).select('-createdAt -updatedAt -status');
    res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const product: IProduct | null = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    const { value } = validateRequest(UpdateProductDto, req.body);

    const updatedProduct: IProduct | null = await Product.findByIdAndUpdate(
      productId,
      { ...value },
      { new: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ data: 'Product updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updatProductStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    if (!product) {
      return next(new ApiExceptionHandler('No Record With The Given Id', 400));
    }
    return res.status(200).json({ data: product });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const deletedProduct: IProduct | null = await Product.findByIdAndDelete(
      productId,
    );
    if (!deletedProduct) {
      return next(new ApiExceptionHandler('Product not found', 400));
    }
    res.status(200).json({ data: 'Product deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

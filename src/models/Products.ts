import mongoose from 'mongoose';
import { PRODUCT_STATUS_ENUM } from '../shared/enums';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  img: string;
  status: PRODUCT_STATUS_ENUM;
}

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: [PRODUCT_STATUS_ENUM.ACTIVE, PRODUCT_STATUS_ENUM.IN_ACTIVE],
      default: PRODUCT_STATUS_ENUM.ACTIVE,
    },
    img: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<IProduct>('Product', ProductSchema);

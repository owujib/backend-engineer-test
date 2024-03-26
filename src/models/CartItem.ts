import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  productId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  version: number;
}

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  version: { type: Number, default: 0 },
});

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);

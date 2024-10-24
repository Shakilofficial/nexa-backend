import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'canceled' | 'processing' | 'shipped' | 'delivered';
  deliveryAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'canceled', 'processing', 'shipped', 'delivered'],
      default: 'pending',
    },
    deliveryAddress: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>('Order', orderSchema);

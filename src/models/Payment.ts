import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  amount: number;
  paymentDate: Date;
}

const paymentSchema = new Schema<IPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>('Payment', paymentSchema);

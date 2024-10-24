import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from './Category';

export interface IReview {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: mongoose.Types.ObjectId | ICategory;
  subCategory: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>('Product', productSchema);

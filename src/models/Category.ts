import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  subCategories: string[];
  description: string;
  icon: string;
  status: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  subCategories: [{ type: String }],
  description: {
    type: String,
    default: 'Latest gadgets and electronic devices',
  },
  icon: { type: String, default: 'electronics-icon.png' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

export default mongoose.model<ICategory>('Category', categorySchema);

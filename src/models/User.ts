import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  address?: string;
  phone?: string;
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  tokenVersion: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
// import file
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: { type: String },
    phone: { type: String },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);

export const excludePassword = (user: IUser) => {
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

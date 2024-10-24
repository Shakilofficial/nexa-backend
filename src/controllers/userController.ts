import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadOnCloudinary } from '../utils/cloudinary';

const excludePassword = (user: IUser) => {
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    let avatarUrl;
    if (req.file) {
      console.log('File uploaded:', req.file);
      const result = await uploadOnCloudinary(req.file.path);
      avatarUrl = result?.secure_url;
      console.log('Cloudinary result:', result);
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '3d',
    });

    const userResponse = excludePassword(user);
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: userResponse, token },
          'User registered successfully',
        ),
      );
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  console.log('Received login request body:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password:', { email, password });
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );

  res
    .status(200)
    .json(new ApiResponse(200, { user, token }, 'User logged in successfully'));
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.address) user.address = req.body.address;
    if (req.body.phone) user.phone = req.body.phone;

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (result?.secure_url) {
        user.avatar = result.secure_url;
      }
    }

    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, user, 'Profile updated successfully'));
  },
);

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  console.log('getProfile called, req.user:', req.user);

  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await User.findById(req.user._id);
  console.log('User found:', user);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile retrieved successfully'));
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  user.tokenVersion += 1;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

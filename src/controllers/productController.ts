import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import User from '../models/User';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('category');
    res
      .status(200)
      .json(new ApiResponse(200, products, 'Products retrieved successfully'));
  } catch (error) {
    console.error('Error retrieving products:', error);
    throw new ApiError(500, 'Error retrieving products');
  }
});

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res
      .status(200)
      .json(new ApiResponse(200, product, 'Product retrieved successfully'));
  },
);

export const addProductReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user?._id as mongoose.Types.ObjectId;

    // Check if all required fields are present
    if (!rating || !comment) {
      throw new ApiError(400, 'Rating and comment are required');
    }

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Find the user to get the name and avatar
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.some(
      (review) => review.userId.toString() === userId?.toString(),
    );
    if (alreadyReviewed) {
      throw new ApiError(400, 'You have already reviewed this product');
    }

    // Create the review object
    const review = {
      userId,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
      createdAt: new Date(),
    };

    // Add the review to the product's reviews array
    product.reviews.push(review);

    // Save the updated product
    await product.save();

    res
      .status(201)
      .json(new ApiResponse(201, product.reviews, 'Review added successfully'));
  },
);

export const deleteProductReview = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.id; // Get productId from the route parameter
    const userId = req.user?._id; // Assuming this is the authenticated user's ID

    // Check if productId is valid
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Find the index of the review made by the user
    const reviewIndex = product.reviews.findIndex(
      (review) => review.userId.toString() === userId?.toString(),
    );

    // If the review is not found, throw an error
    if (reviewIndex === -1) {
      throw new ApiError(
        404,
        'Review not found or you do not have permission to delete this review',
      );
    }

    // Remove the review from the reviews array
    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  },
);

import { Request, Response } from 'express';
import Category from '../models/Category';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await Category.find();

    res
      .status(200)
      .json(
        new ApiResponse(200, categories, 'Categories retrieved successfully'),
      );
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    res
      .status(200)
      .json(new ApiResponse(200, category, 'Category retrieved successfully'));
  },
);

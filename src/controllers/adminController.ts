import { Request, Response } from 'express';
import Category from '../models/Category';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadOnCloudinary } from '../utils/cloudinary';

// Get all users (excluding logged-in admin)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const loggedInAdminId = req.user?._id; // Get the ID of the logged-in admin

  const users = await User.find({ _id: { $ne: loggedInAdminId } }); // Filter out the logged-in admin

  res
    .status(200)
    .json(new ApiResponse(200, users, 'Users fetched successfully'));
});

// Get user details with order history
export const getUserWithOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Fetch orders related to the user
    const orders = await Order.find({ userId }); // This should match your order schema

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user, orders },
          `User with ID ${userId} and their orders fetched successfully`,
        ),
      );
  },
);

// Delete a user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await user.deleteOne();
  res
    .status(200)
    .json(
      new ApiResponse(200, null, `User with ID ${userId} deleted successfully`),
    );
});

// Create a new product 
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, brand, category, subCategory, price, stock, description } =
      req.body;
    const files = req.files as Express.Multer.File[];

    if (
      !name ||
      !brand ||
      !category ||
      !subCategory ||
      !price ||
      !stock ||
      !description
    ) {
      throw new ApiError(400, 'All fields are required');
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const result = await uploadOnCloudinary(file.path);
        return result?.secure_url || null;
      }),
    );

    const product = await Product.create({
      name,
      brand,
      category,
      subCategory,
      price,
      stock,
      description,
      images: images.filter(Boolean),
    });

    res
      .status(201)
      .json(new ApiResponse(201, product, 'Product created successfully'));
  },
);

// Get all products 
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find().populate('category');
  res
    .status(200)
    .json(new ApiResponse(200, products, 'Products retrieved successfully'));
});

// Get product by ID 
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

// Update a product 
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, brand, subCategory, price, stock, description, status } =
      req.body;
    const files = req.files as Express.Multer.File[];

    let product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    let images = product.images;
    if (files && files.length > 0) {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const result = await uploadOnCloudinary(file.path);
          return result?.secure_url || null;
        }),
      );
      images = newImages.filter((url): url is string => url !== null);
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        brand: brand || product.brand,
        subCategory: subCategory || product.subCategory,
        price: price || product.price,
        stock: stock || product.stock,
        description: description || product.description,
        images,
        ...(status && { status }),
      },
      { new: true, runValidators: true },
    );

    res
      .status(200)
      .json(new ApiResponse(200, product, 'Product updated successfully'));
  },
);

// Delete a product 
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, {}, 'Product deleted successfully'));
  },
);

//Category Controller

// Create Category
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, subCategories, description, status } = req.body;
    const file = req.file as Express.Multer.File;

    if (!name) {
      throw new ApiError(400, 'Category name is required');
    }

    let iconUrl = null;
    if (file) {
      const result = await uploadOnCloudinary(file.path);
      iconUrl = result?.secure_url || null;
    }

    const category = await Category.create({
      name,
      subCategories,
      description,
      icon: iconUrl,
      status,
    });

    res
      .status(201)
      .json(new ApiResponse(201, category, 'Category created successfully'));
  },
);

// Update Category
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, subCategories, description, status } = req.body;
    const file = req.file as Express.Multer.File; // Single file for icon

    let category = await Category.findById(req.params.id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    let iconUrl = category.icon;
    if (file) {
      const result = await uploadOnCloudinary(file.path);
      iconUrl = result?.secure_url || iconUrl;
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        subCategories,
        description,
        icon: iconUrl,
        status,
      },
      { new: true, runValidators: true },
    );

    res
      .status(200)
      .json(new ApiResponse(200, category, 'Category updated successfully'));
  },
);

// Delete Category
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, 'Category deleted successfully'));
  },
);

//Order Controller
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find().populate('products.productId');
    res
      .status(200)
      .json(new ApiResponse(200, orders, 'All orders retrieved successfully'));
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    order.status = status;
    await order.save();
    res
      .status(200)
      .json(new ApiResponse(200, order, 'Order status updated successfully'));
  },
);

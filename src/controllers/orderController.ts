import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { IUser } from '../models/User';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

interface AuthenticatedRequest extends Request {
  user?: IUser & { _id: string };
}

// Create Order
export const createOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { products, totalAmount, deliveryAddress } = req.body;

    if (!products || !totalAmount || !deliveryAddress) {
      throw new ApiError(400, 'All fields are required');
    }

    // Check stock and update product quantities
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for product: ${product.name}`,
        );
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user!._id,
      products,
      totalAmount,
      deliveryAddress,
    });

    res
      .status(201)
      .json(new ApiResponse(201, order, 'Order created successfully'));
  },
);

// Get Orders by User ID
export const getOrdersByUserId = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const orders = await Order.find({ userId: req.user!._id }).populate(
      'products.productId',
    );
    res
      .status(200)
      .json(new ApiResponse(200, orders, 'Orders retrieved successfully'));
  },
);

// Get Order by ID
export const getOrderById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const order = await Order.findById(req.params.id).populate(
      'products.productId',
    );

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (order.userId.toString() !== req.user!._id.toString()) {
      throw new ApiError(403, 'Not authorized to access this order');
    }

    res
      .status(200)
      .json(new ApiResponse(200, order, 'Order retrieved successfully'));
  },
);

// Cancel Order
export const cancelOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const orderId = req.params.id;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Check if the user is authorized to cancel the order
    if (order.userId.toString() !== req.user!._id.toString()) {
      throw new ApiError(403, 'Not authorized to cancel this order');
    }

    // Optionally check the status of the order to allow cancellation
    if (order.status !== 'pending') {
      throw new ApiError(400, 'Only pending orders can be canceled');
    }

    // Cancel the order
    order.status = 'canceled'; // Assuming you have a 'canceled' status
    await order.save();

    res
      .status(200)
      .json(new ApiResponse(200, order, 'Order canceled successfully'));
  },
);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = exports.deleteUser = exports.getUserWithOrders = exports.getAllUsers = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
// Get all users (excluding logged-in admin)
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loggedInAdminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Get the ID of the logged-in admin
    const users = yield User_1.default.find({ _id: { $ne: loggedInAdminId } }); // Filter out the logged-in admin
    res
        .status(200)
        .json(new ApiResponse_1.default(200, users, 'Users fetched successfully'));
}));
// Get user details with order history
exports.getUserWithOrders = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield User_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    // Fetch orders related to the user
    const orders = yield Order_1.default.find({ userId }); // This should match your order schema
    res
        .status(200)
        .json(new ApiResponse_1.default(200, { user, orders }, `User with ID ${userId} and their orders fetched successfully`));
}));
// Delete a user
exports.deleteUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield User_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    yield user.deleteOne();
    res
        .status(200)
        .json(new ApiResponse_1.default(200, null, `User with ID ${userId} deleted successfully`));
}));
// Create a new product 
exports.createProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, brand, category, subCategory, price, stock, description } = req.body;
    const files = req.files;
    if (!name ||
        !brand ||
        !category ||
        !subCategory ||
        !price ||
        !stock ||
        !description) {
        throw new ApiError_1.default(400, 'All fields are required');
    }
    const images = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, cloudinary_1.uploadOnCloudinary)(file.path);
        return (result === null || result === void 0 ? void 0 : result.secure_url) || null;
    })));
    const product = yield Product_1.default.create({
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
        .json(new ApiResponse_1.default(201, product, 'Product created successfully'));
}));
// Get all products 
exports.getProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find().populate('category');
    res
        .status(200)
        .json(new ApiResponse_1.default(200, products, 'Products retrieved successfully'));
}));
// Get product by ID 
exports.getProductById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id).populate('category');
    if (!product) {
        throw new ApiError_1.default(404, 'Product not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.default(200, product, 'Product retrieved successfully'));
}));
// Update a product 
exports.updateProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, brand, subCategory, price, stock, description, status } = req.body;
    const files = req.files;
    let product = yield Product_1.default.findById(req.params.id);
    if (!product) {
        throw new ApiError_1.default(404, 'Product not found');
    }
    let images = product.images;
    if (files && files.length > 0) {
        const newImages = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, cloudinary_1.uploadOnCloudinary)(file.path);
            return (result === null || result === void 0 ? void 0 : result.secure_url) || null;
        })));
        images = newImages.filter((url) => url !== null);
    }
    product = yield Product_1.default.findByIdAndUpdate(req.params.id, Object.assign({ name: name || product.name, brand: brand || product.brand, subCategory: subCategory || product.subCategory, price: price || product.price, stock: stock || product.stock, description: description || product.description, images }, (status && { status })), { new: true, runValidators: true });
    res
        .status(200)
        .json(new ApiResponse_1.default(200, product, 'Product updated successfully'));
}));
// Delete a product 
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id);
    if (!product) {
        throw new ApiError_1.default(404, 'Product not found');
    }
    yield Product_1.default.findByIdAndDelete(req.params.id);
    res
        .status(200)
        .json(new ApiResponse_1.default(200, {}, 'Product deleted successfully'));
}));
//Category Controller
// Create Category
exports.createCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, subCategories, description, status } = req.body;
    const file = req.file;
    if (!name) {
        throw new ApiError_1.default(400, 'Category name is required');
    }
    let iconUrl = null;
    if (file) {
        const result = yield (0, cloudinary_1.uploadOnCloudinary)(file.path);
        iconUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || null;
    }
    const category = yield Category_1.default.create({
        name,
        subCategories,
        description,
        icon: iconUrl,
        status,
    });
    res
        .status(201)
        .json(new ApiResponse_1.default(201, category, 'Category created successfully'));
}));
// Update Category
exports.updateCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, subCategories, description, status } = req.body;
    const file = req.file; // Single file for icon
    let category = yield Category_1.default.findById(req.params.id);
    if (!category) {
        throw new ApiError_1.default(404, 'Category not found');
    }
    let iconUrl = category.icon;
    if (file) {
        const result = yield (0, cloudinary_1.uploadOnCloudinary)(file.path);
        iconUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || iconUrl;
    }
    category = yield Category_1.default.findByIdAndUpdate(req.params.id, {
        name,
        subCategories,
        description,
        icon: iconUrl,
        status,
    }, { new: true, runValidators: true });
    res
        .status(200)
        .json(new ApiResponse_1.default(200, category, 'Category updated successfully'));
}));
// Delete Category
exports.deleteCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.default.findByIdAndDelete(req.params.id);
    if (!category) {
        throw new ApiError_1.default(404, 'Category not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.default(200, {}, 'Category deleted successfully'));
}));
//Order Controller
exports.getAllOrders = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find().populate('products.productId');
    res
        .status(200)
        .json(new ApiResponse_1.default(200, orders, 'All orders retrieved successfully'));
}));
exports.updateOrderStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = yield Order_1.default.findById(orderId);
    if (!order) {
        throw new ApiError_1.default(404, 'Order not found');
    }
    order.status = status;
    yield order.save();
    res
        .status(200)
        .json(new ApiResponse_1.default(200, order, 'Order status updated successfully'));
}));
//# sourceMappingURL=adminController.js.map
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
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.protect = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Extract the token from the authorization header
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        throw new ApiError_1.default(401, 'Not authorized, token not found');
    }
    try {
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find the user by the decoded token's user ID
        const user = yield User_1.default.findById(decoded.id);
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            throw new ApiError_1.default(401, 'Not authorized, invalid token');
        }
        req.user = user;
        next();
    }
    catch (err) {
        const error = err;
        console.error('Token verification failed:', error);
        if (error.name === 'TokenExpiredError') {
            throw new ApiError_1.default(401, 'Token expired, please log in again');
        }
        else {
            throw new ApiError_1.default(401, 'Not authorized, token failed');
        }
    }
}));
// Admin Authorization Middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        throw new ApiError_1.default(403, 'Not authorized as admin');
    }
};
exports.admin = admin;
//# sourceMappingURL=authMiddleware.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }
    else {
        res.status(500).json({
            message: 'Something went wrong',
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    }
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=errorMiddleware.js.map
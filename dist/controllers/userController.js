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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.getProfile = exports.updateProfile = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
const cloudinary_1 = require("../utils/cloudinary");
const excludePassword = (user) => {
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return userWithoutPassword;
};
exports.registerUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError_1.default(400, 'All fields are required');
    }
    const existingUser = yield User_1.default.findOne({ email });
    if (existingUser) {
        throw new ApiError_1.default(409, 'User with this email already exists');
    }
    let avatarUrl;
    if (req.file) {
        console.log('File uploaded:', req.file);
        const result = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
        avatarUrl = result === null || result === void 0 ? void 0 : result.secure_url;
        console.log('Cloudinary result:', result);
    }
    const user = yield User_1.default.create({
        name,
        email,
        password,
        avatar: avatarUrl,
    });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
    const userResponse = excludePassword(user);
    res
        .status(201)
        .json(new ApiResponse_1.default(201, { user: userResponse, token }, 'User registered successfully'));
}));
exports.loginUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received login request body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        console.log('Missing email or password:', { email, password });
        throw new ApiError_1.default(400, 'Email and password are required');
    }
    const user = yield User_1.default.findOne({ email }).select('+password');
    if (!user || !(yield user.comparePassword(password))) {
        throw new ApiError_1.default(401, 'Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res
        .status(200)
        .json(new ApiResponse_1.default(200, { user, token }, 'User logged in successfully'));
}));
exports.updateProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new ApiError_1.default(401, 'Unauthorized');
    }
    const user = yield User_1.default.findById(req.user._id);
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    if (req.body.name)
        user.name = req.body.name;
    if (req.body.email)
        user.email = req.body.email;
    if (req.body.address)
        user.address = req.body.address;
    if (req.body.phone)
        user.phone = req.body.phone;
    if (req.file) {
        const result = yield (0, cloudinary_1.uploadOnCloudinary)(req.file.path);
        if (result === null || result === void 0 ? void 0 : result.secure_url) {
            user.avatar = result.secure_url;
        }
    }
    yield user.save();
    res
        .status(200)
        .json(new ApiResponse_1.default(200, user, 'Profile updated successfully'));
}));
exports.getProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getProfile called, req.user:', req.user);
    if (!req.user) {
        throw new ApiError_1.default(401, 'Unauthorized');
    }
    const user = yield User_1.default.findById(req.user._id);
    console.log('User found:', user);
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    res
        .status(200)
        .json(new ApiResponse_1.default(200, user, 'Profile retrieved successfully'));
}));
exports.logoutUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new ApiError_1.default(401, 'Unauthorized');
    }
    const user = yield User_1.default.findById(req.user._id);
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    user.tokenVersion += 1;
    yield user.save();
    res.status(200).json(new ApiResponse_1.default(200, null, 'Logged out successfully'));
}));
//# sourceMappingURL=userController.js.map
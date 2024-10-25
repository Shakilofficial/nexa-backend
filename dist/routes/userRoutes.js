"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const router = express_1.default.Router();
router.post('/register', multerMiddleware_1.upload.single('avatar'), userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.put('/profile', authMiddleware_1.protect, multerMiddleware_1.upload.single('avatar'), userController_1.updateProfile);
router.get('/profile', authMiddleware_1.protect, userController_1.getProfile);
router.post('/logout', authMiddleware_1.protect, userController_1.logoutUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
import express from 'express';
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/multerMiddleware';

const router = express.Router();

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logoutUser);
export default router;

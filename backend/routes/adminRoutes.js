import express from 'express';
import 'dotenv/config';
import { protect } from '../middleware/auth.js';
import { adminLogin, currentAdmin, deleteAdmin, deleteUser, getAdmins, getAllUsers, getDashboardStats, getRecentCommunities, getRecentSignups, moodTrends, newAdmin, updateAdmin, userGrowth } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', protect, newAdmin);
router.post('/login', protect, adminLogin);
router.get('/list', protect, getAdmins);
router.get("/me", protect, currentAdmin);
router.put('/users/:id', protect, updateAdmin);
router.delete('/admins/:id', protect, deleteAdmin)
router.get('/user-growth', userGrowth) // User Growth - Count no of users per month
router.get('/mood-trends',moodTrends)
router.get('/dashboard', protect, getDashboardStats)
router.get('/recent-signups', protect, getRecentSignups)
router.get('/recent-communities', protect, getRecentCommunities);
router.get('/users/', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);

export default router;

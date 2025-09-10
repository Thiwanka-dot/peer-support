import express from "express";
import { protect } from '../middleware/auth.js';
import { createCommunity, deleteCommunity, getCommunities, joinCommunity, leaveCommunity, updateCommunity } from "../controllers/communityController.js";

const router = express.Router();

router.get('/communities', protect, getCommunities);
router.post('/communities', protect, createCommunity);
router.put('/communities/:id', protect, updateCommunity);
router.delete('/communities/:id', protect, deleteCommunity);
router.post('/communities/:id/join', protect, joinCommunity);
router.post('/communities/:id/leave', protect, leaveCommunity);

export default router;

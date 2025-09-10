import express from 'express';
import { protect } from '../middleware/auth.js'
import { saveMood, getMoods, getMoodById, getDailyMoods, updateMood, deleteMood } from '../controllers/moodController.js';

const router = express.Router()

router.post('/save', protect, saveMood)
router.get('/get', protect, getMoods)
router.get('/daily', protect, getDailyMoods)
router.get('/:id', protect, getMoodById)
router.put('/:id', protect, updateMood)
router.delete('/:id', protect, deleteMood)

export default router
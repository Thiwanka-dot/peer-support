import express from 'express';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectPeer, currentUser, deleteUser, disconnectPeer, getUserList, getUsers, updateProfile } from '../controllers/userController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Get current user
router.get('/me', protect, currentUser);

router.put('/update', protect, upload.single('userImage'), updateProfile);
router.get('/peers', protect, getUsers);
router.post('/connect/:peerId', protect, connectPeer)
router.post('/disconnect/:peerId', protect, disconnectPeer);
router.get("/chat", protect, getUserList);
router.delete("/delete", protect, deleteUser);

export default router;

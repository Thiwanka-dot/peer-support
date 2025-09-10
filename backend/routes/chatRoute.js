import express from "express";
import { protect } from "../middleware/auth.js";
import { communitiesChat, deleteMessage, editMessage, recentMessages } from "../controllers/chatController.js";

const router = express.Router();

router.get("/communities", protect, communitiesChat);
router.get("/recent", protect, recentMessages);
router.put("/message/:id", protect, editMessage);
router.delete("/message/:id", protect, deleteMessage);


export default router;

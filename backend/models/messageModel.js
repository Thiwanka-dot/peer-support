import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatType: { type: String, enum: ['peer', 'community'], required: true },
    chatId: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true },
    time: { type: Date, default: Date.now },
    isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

const messageModel = mongoose.models.message || mongoose.model('Message', messageSchema);   

export default messageModel

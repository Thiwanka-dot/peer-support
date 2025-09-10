import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    mood: { type: String, required: true },
    reason: { type: String },
}, { timestamps: true });

const moodModel = mongoose.models.mood || mongoose.model('mood', moodSchema);   

export default moodModel
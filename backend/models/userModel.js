import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    userImage: { type: String, default: '' },
    mentalIssues: [{ type: String }],
    
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Date },

    peers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community'
    }]
    
}, { timestamps: true});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
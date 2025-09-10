import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    issueType: [{ type: String }],
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        joinedAt: { type: Date, default: Date.now }
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {timestamps:true})

const communityModel = mongoose.models.community || mongoose.model('community', communitySchema);   
export default communityModel;
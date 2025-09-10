import communityModel from "../models/communityModel.js";
import userModel from "../models/userModel.js";

export const getCommunities = async (req,res) => {
    try {
        const communities = await communityModel.find()
          .populate('members.user', 'name');
        
        res.status(200).json({ success: true, communities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createCommunity = async (req, res) => {
  try {
    const { name, issueType, description } = req.body;

    if (!name || !issueType || !description) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const community = new communityModel({ name, issueType, description });
    await community.save();
    res.status(201).json({ success: true, message: "Community created successfully", community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create community" });
  }
};


export const updateCommunity = async (req,res) => {
    try {
        const { name, issueType, description } = req.body;
        const community = await communityModel.findByIdAndUpdate(
            req.params.id,
            { name, issueType, description },
        {  new: true }
        );

        if (!community) return res.status(404).json({ success: false, message: "Community not found" });
        res.status(200).json({ success: true, message: "Community updated", community });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteCommunity = async (req,res) => {
    try {
        await communityModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Community deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const joinCommunity = async (req,res) => {
    try {
        const community = await communityModel.findById(req.params.id);
        const user = await userModel.findById(req.user._id);
    
        if (!community || !user) {
            return res.status(404).json({ success: false, message: 'Community or user not found!' });
        }
    
        if (community.members.some(m => m.user.toString() === user._id.toString())) {
            return res.status(400).json({ success: false, message: "Already joined" });
        }
    
        community.members.push({ user: user._id });
        await community.save();
    
        if (!user.communities.some(cid => cid.toString() === community._id.toString())) {
            user.communities.push(community._id);
            await user.save();
        }
    
        res.status(200).json({ success: true, message: "Joined community", community });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const leaveCommunity = async (req,res) => {
    try {
        const community = await communityModel.findById(req.params.id);
        const user = await userModel.findById(req.user._id);

        if (!community || !user) {
            return res.status(404).json({ success: false, message: 'Community or user not found!' });
        }

        community.members = community.members.filter(m => m.user.toString() !== user._id.toString());
        await community.save();

        user.communities = user.communities.filter(cid => cid.toString() !== community._id.toString());
        await user.save();

        res.status(200).json({ success: true, message: 'Left community', community });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
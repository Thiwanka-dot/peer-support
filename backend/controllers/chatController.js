import communityModel from "../models/communityModel.js";
import messageModel from "../models/messageModel.js";

// Fetch communities the user belongs to
export const communitiesChat = async (req, res) => {
    try {
        const communities = await communityModel
            .find({ "members.user": req.user._id })
            .select("name _id")
            .lean();
        res.status(200).json({ success: true, communities });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get recent messages (latest 5 combined from peers & communities)
export const recentMessages = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        // 1. Get joined communities
        const joinedCommunities = await communityModel.find({
            "members.user": userId
        }).select("_id name").lean();

        const communityIds = joinedCommunities.map(c => c._id.toString());

        // 2. Peer messages (any chat that includes userId in chatId)
        const peerMsgs = await messageModel.find({
            chatType: "peer",
            chatId: { $regex: userId }
        })
            .populate("sender", "name")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        peerMsgs.forEach(msg => {
            msg.chatName = "Peer Chat";
        });

        // 3. Community messages (always use community _id format, not old name format)
        const commMsgs = await messageModel.find({
            chatType: "community",
            chatId: { $in: communityIds }
        })
            .populate("sender", "name")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        commMsgs.forEach(msg => {
            const comm = joinedCommunities.find(c => c._id.toString() === msg.chatId);
            msg.chatName = comm ? `Community: ${comm.name}` : "Community Chat";
        });

        // 4. Merge and sort all messages by newest first
        const allMsgs = [...peerMsgs, ...commMsgs].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // 5. Take the latest 5 messages
        const latestFive = allMsgs.slice(0, 5);

        res.json({ success: true, messages: latestFive });
    } catch (error) {
        console.error("Error fetching recent messages:", error);
        res.status(500).json({ success: false, message: "Failed to fetch messages" });
    }
};

// Edit a message
export const editMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const message = await messageModel.findById(req.params.id);

        if (!message) return res.status(404).json({ success: false, message: "Message not found" });
        if (message.sender.toString() !== req.user._id.toString())
            return res.status(403).json({ success: false, message: "Not authorized" });

        message.text = text;
        await message.save();

        res.status(200).json({ success: true, message });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const message = await messageModel.findById(req.params.id);

        if (!message) return res.status(404).json({ success: false, message: "Message not found" });
        if (message.sender.toString() !== req.user._id.toString())
            return res.status(403).json({ success: false, message: "Not authorized" });

        await message.deleteOne();
        res.status(200).json({ success: true, message: "Message deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

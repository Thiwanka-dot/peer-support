import userModel from "../models/userModel.js";

export const currentUser = async (req,res) => {
    if (req.type !== 'user' || !req.user) {
        return res.status(401).json({ success: false, message: "Not authorized as user" });
    }
    res.status(200).json({ success: true, user: req.user });
}

export const updateProfile = async (req,res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.name = Array.isArray(req.body.name) ? req.body.name[0] : req.body.name || user.name;
        user.email = Array.isArray(req.body.email) ? req.body.email[0] : req.body.email || user.email;

        // Handle Date of Birth
        if (req.body.dob) {
            const dobValue = Array.isArray(req.body.dob) ? req.body.dob[0] : req.body.dob;
            user.dob = new Date(dobValue);
        }

        // Mental issues as array
        user.mentalIssues = req.body.mentalIssues
            ? req.body.mentalIssues.split(',').map(i => i.trim()).filter(i => i)
            : user.mentalIssues;

        if (req.file) {
            user.userImage = req.file.filename;
        }

        await user.save();
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export const getUsers = async (req,res) => {
    try {
        const users = await userModel.find({}, "name userImage mentalIssues")
            .populate("communities", "name");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch peers", error: err.message });
    }
}

export const connectPeer = async (req,res) => {
    try {
        const userId = req.user._id;
        const { peerId } = req.params

        if (userId.toString() === peerId) {
            return res.status(400).json({ error: "You cannot connect with yourself!"})
        }

        const user = await userModel.findById(userId)
        const peer = await userModel.findById(peerId)

        if (!peer) return res.status(404).json({ error: "Peer not found!"})
        
        // Prevent duplicate
        if(user.peers.includes(peerId)){
            return res.status(400).json({ error: "Already connected with this peer!"})
        }

        // Add each other
        user.peers.push(peerId)
        peer.peers.push(userId)

        await user.save()
        await peer.save()
        res.status(200).json({success: true, message: "Connected successfully!"})

    } catch (error) {
        res.status(500).json({ error: "Failed to connect with peer", details: error.message })
    }
}

export const disconnectPeer = async (req,res) => {
    try {
        const userId = req.user._id;
        const { peerId } = req.params;

        if (userId.toString() === peerId) {
            return res.status(400).json({ error: "You cannot disconnect from yourself!" });
        }

        const user = await userModel.findById(userId);
        const peer = await userModel.findById(peerId);

        if (!peer) return res.status(404).json({ error: "Peer not found!" });

        // Remove each other from peers array
        user.peers = user.peers.filter(id => id.toString() !== peerId);
        peer.peers = peer.peers.filter(id => id.toString() !== userId.toString());

        await user.save();
        await peer.save();

        res.status(200).json({ success: true, message: "Disconnected successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to disconnect from peer", details: error.message });
    }
}

export const getUserList = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("peers", "name") // ensure peers are populated
      .populate("communities", "name"); // ensure communities are populated

    res.json({
      peers: Array.isArray(user.peers)
        ? user.peers.map(p => ({ _id: p._id, name: p.name || "Unknown" }))
        : [],
      communities: Array.isArray(user.communities)
        ? user.communities.map(c => ({ _id: c._id, name: c.name || "Unknown" }))
        : [],
    });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Failed to load chats", details: err.message });
  }
};

export const deleteUser = async (req,res) => {
    try {
        const userId = req.user._id;

        await userModel.findByIdAndDelete(userId);

        res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (err) {
        console.error("Delete account error:", err);
        res.status(500).json({ success: false, message: "Failed to delete account", error: err.message });
    }
}
import userModel from '../models/userModel.js';
import communityModel from '../models/communityModel.js';
import messageModel from '../models/messageModel.js';
import moodModel from '../models/moodModel.js'
import adminModel from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const newAdmin = async (req,res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const newAdmin = new adminModel({ name, email, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const adminLogin = async (req,res) => {
  const { email, password } = req.body;
  
  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send as cookie (httpOnly)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in",
      token // optional: for debugging/localStorage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const currentAdmin = async (req,res) => {
  if (req.type !== 'admin' || !req.admin) {
      return res.status(401).json({ success: false, message: "Not authorized as admin" });
  }
  res.status(200).json({ success: true, admin: req.admin });
}

export const getAdmins = async (req,res) => {
  try {
    const admins = await adminModel.find().select('-password').lean();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const updateAdmin = async (req,res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const admin = await adminModel.findById(id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) admin.password = password; // Will be hashed due to pre-save hook

    await admin.save();

    res.status(200).json({ success: true, message: 'Admin updated successfully', admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await adminModel.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userGrowth = async (req,res) => {
  try {
    const users = await userModel.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 }}
    ])

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    // Convert results to labels and data for charts
    const labels = users.map(u => monthNames[u._id-1]);
    const data = users.map(u => u.count);

    res.status(200).json({ success: true, labels, data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: false, message: "Error fetching user growth"})
  }
}

export const moodTrends = async (req,res) => {
  try {
    const moods = await moodModel.aggregate([
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 }}
    ]);

    const moodLabels = moods.map(m => m._id);
    const counts = moods.map(m => m.count)

    res.status(200).json({ success: true, moods: moodLabels, counts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error fetching mood trends"})
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const activeCommunities = await communityModel.countDocuments();
    const privateChats = await messageModel.countDocuments({ chatType: 'peer' });
    const moodLogs = await moodModel.countDocuments();

    const userGrowth = await userModel.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 }},
    ]);

    const moodTrends = await moodModel.aggregate([
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 }}
    ]);

    res.status(200).json({
      success: true,
      stats: { totalUsers, activeCommunities, privateChats, moodLogs },
      charts: { userGrowth, moodTrends },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users with peers + communities populated
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()
      .populate("peers", "name email")
      .populate("communities", "name")
      .select("name email isVerified peers communities");

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Recent signups
export const getRecentSignups = async (req, res) => {
    try {
        const users = await userModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name createdAt')
        
            res.status(200).json({ success: true, users })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Recent community chats
export const getRecentCommunities = async (req, res) => {
  try {
    const communities = await communityModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    res.status(200).json({ success: true, communities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

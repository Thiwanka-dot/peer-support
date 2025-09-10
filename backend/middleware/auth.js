import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import adminModel from '../models/adminModel.js';

export const protect = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check admin first
        const admin = await adminModel.findById(decoded.id).select('-password');
        if (admin) {
            req.admin = admin;
            req.type = 'admin';
            return next();
        }

        // Check user
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        req.user = user;
        req.type = 'user';
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export default protect;

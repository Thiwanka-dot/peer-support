import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/userModel.js"
import transporter from "../utils/email.js"
import adminModel from "../models/adminModel.js"
import userModel from "../models/userModel.js"

const isProduction = process.env.NODE_ENV === 'production'

// Register
export const register = async (req, res) => {
    const { name, email, dob, password, confirmPassword } = req.body

    if (!name || !email || !dob || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "Please fill all the fields!" })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match!" })
    }

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000)
    const otpExpireAt = Date.now() + 15 * 60 * 1000

    try {
        const user = new UserModel({
            name,
            email,
            dob,
            password: hashedPassword,
            verifyOtp: otp.toString(),
            verifyOtpExpireAt: otpExpireAt
        })

        await user.save()

        const welcomeHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px;">
                <h2 style="color: #2c3e50; text-align: center;">👋 Welcome to PeerConnect, ${name}!</h2>
                <p>Thank you for registering. Please use the following one-time password (OTP) to verify your email:</p>
                <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background-color: #f4f4f4; padding: 12px 20px; border-radius: 8px; text-align: center; margin: 20px 0; color: #333;">
                    ${otp}
                </div>
                <p style="text-align: center;">This code will expire in <strong>15 minutes</strong>.</p>
                <hr style="margin: 30px 0;" />
                <p style="font-size: 12px; color: #888;">If you did not sign up, you can safely ignore this email.</p>
            </div>
        `

        transporter.sendMail({
            from: `"PeerConnect" <${process.env.Email_Username}>`,
            to: email,
            subject: 'Your OTP for Email Verification - PeerConnect',
            html: welcomeHtml,
        }, (err, info) => {
            if (err) console.error("Failed to send OTP email:", err)
            else console.log("OTP email sent:", info.response)
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Login
export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" })
    }

    try {
        // Try user login
        const user = await UserModel.findOne({ email })
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (isPasswordValid) {
                const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' })
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: isProduction ? 'none' : 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.status(200).json({ 
                    success: true, 
                    type: 'user', 
                    user: { id: user._id, name: user.name, email: user.email }
                })
            }
        }

        // Try admin login
        const admin = await adminModel.findOne({ email })
        if (admin) {
            const isPasswordValid = await bcrypt.compare(password, admin.password)
            if (isPasswordValid) {
                const token = jwt.sign({ id: admin._id, type: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: isProduction ? 'none' : 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                return res.status(200).json({ 
                    success: true, 
                    type: 'admin', 
                    admin: { id: admin._id, name: admin.name, email: admin.email }
                })
            }
        }

        return res.status(400).json({ success: false, message: "Invalid email or password" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        })

        return res.status(200).json({ success: true, message: "Logged out successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Verify Email
export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    try {
        const user = await UserModel.findOne({ email })
        if (!user || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP or user not found' })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' })
        }

        user.isVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0
        await user.save()

        res.status(200).json({ success: true, message: 'Email verified successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Request Reset Password
export const requestReset = async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, message: "Email is required!" })

    try {
        const user = await UserModel.findOne({ email })
        if (!user) return res.status(400).json({ success: false, message: "User not found!" })

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString()
        const expireAt = new Date(Date.now() + 15 * 60 * 1000)

        user.resetOtp = resetToken
        user.resetOtpExpireAt = expireAt
        await user.save()

        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`

        const resetHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; padding: 20px;  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2c3e50; text-align: center;">Password Reset Request</h2>
            <hr style="border: none; border-top: 2px solid #34DCA7; margin: 20px 0;" />
            <p style="font-size: 16px; line-height: 1.5;">To reset your password, please click the link below:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background-color: #34DCA7; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s; text-align: center;">
                Reset Password
            </a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 10px;" />
            <p style="font-size: 12px; color: #888; text-align: center;">This link will expire in 15 minutes.</p>
        </div>
        `

        transporter.sendMail({
            from: `"PeerConnect" <${process.env.Email_Username}>`,
            to: email,
            subject: 'Password Reset - PeerConnect',
            html: resetHtml,
        }, (err, info) => {
            if (err) {
                console.error("Failed to send password reset email:", err)
                return res.status(500).json({ success: false, message: "Failed to send reset email. Try again later." })
            }
            console.log("Reset email sent:", info.response)
            return res.status(200).json({ success: true, message: "Reset link sent to email!" })
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Reset Password
export const resetPassword = async (req, res) => {
    const { email, token, password, confirmPassword } = req.body

    if (!email || !token || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "All fields are required!" })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match!" })
    }

    try {
        const user = await UserModel.findOne({ email })
        if (!user || user.resetOtp !== token || !user.resetOtpExpireAt || user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired token!" })
        }

        user.password = await bcrypt.hash(password, 10)
        user.resetOtp = ''
        user.resetOtpExpireAt = null
        await user.save()

        res.status(200).json({ success: true, message: "Password reset successfully!" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Check email
export const checkEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await userModel.findOne({ email });
        if (user) return res.json({ exists: true });
        res.json({ exists: false });
    } catch (err) {
        res.status(500).json({ exists: false, error: err.message });
    }
};
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http'

import connectDB from './config/database.js'
import authRouter from './routes/authRoutes.js'
import moodRoutes from './routes/moodRoutes.js'
import userRoutes from './routes/userRoutes.js'
import chatRoute from './routes/chatRoute.js'
import adminRoutes from './routes/adminRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import socketRoutes from './routes/socketRoutes.js'
import transporter from './utils/email.js'
import { Server } from 'socket.io';
import userModel from './models/userModel.js';
import messageModel from './models/messageModel.js';
import communityModel from './models/communityModel.js';
import { socketHandler } from './controllers/socketController.js';

const app = express()
const PORT = process.env.PORT || 5000
const server = http.createServer(app)

connectDB()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/user', userRoutes)
app.use('/api/auth', authRouter)
app.use('/api/mood', moodRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user/chat', chatRoute)
app.use('/api', communityRoutes)
app.use('/api/socket', socketRoutes)

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required!" })
    }

    const adminHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2c3e50; text-align: center;">📥 New Contact Submission</h2>
        <hr style="border: none; border-top: 1px solid #34DCA7; margin: 20px 0;" />
        <p><strong style="color: #00C4EE">Name:</strong> ${name}</p>
        <p><strong style="color: #00C4EE">Email:</strong> ${email}</p>
        <p><strong style="color: #00C4EE">Message:</strong></p>
        <div style="padding: 15px; border: 1px solid #34DCA7; border-radius: 6px; color: #333; font-size: 15px;">
            ${message}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 10px;" />
        <p style="font-size: 12px; color: #888; text-align: center;">This email was generated from your website contact form.</p>
    </div>
    `

    const userHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2c3e50; text-align: center;">Thank You for Reaching Out!</h2>
        <hr style="border: none; border-top: 1px solid #34DCA7; margin: 20px 0;" />
        <p>Dear <strong>${name}</strong>,</p>
        <p>We have received your message and our team will get back to you as soon as possible.</p>
        <p style="margin-top: 30px;">Kind regards,<br/><strong>PeerConnect Support Team</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 10px;" />
        <p style="font-size: 12px; color: #888; text-align: center;">You are receiving this email because you contacted us through our website.</p>
    </div>
    `

    const adminMailOptions = {
        from: email,
        to: process.env.Email_Username,
        subject,
        html: adminHtml,
    }

    const userMailOptions = {
        from: process.env.Email_Username,
        to: email,
        subject: 'Thank you for contacting us!',
        html: userHtml,
    }

    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email to admin: ', error)
            return res.status(500).json({ error: "Failed to send email to admin!" })
        }

        console.log('Admin email sent:', info.response)

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Error sending acknowledgment email to user: ', error)
                return res.status(500).json({ error: "Failed to send acknowledgment email!" })
            }

            console.log('Acknowledgment email sent:', info.response)
            res.status(200).json({ success: true, message: 'Emails sent successfully!' })
        })
    })
})

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketHandler(io)

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
import express from 'express';
import { register, login, logout, verifyEmail, requestReset, resetPassword, checkEmail } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/verify-email', verifyEmail)
authRouter.post('/request-reset', requestReset)
authRouter.post('/reset-password', resetPassword)
authRouter.get('/check-email', checkEmail)

export default authRouter
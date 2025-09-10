import style from './resetpass.module.css'
import API from '../../api/axios'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ResetPass() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [searchParams] = useSearchParams()
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const email = searchParams.get('email')
    const token = searchParams.get('token')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !token) {
            return alert('Invalid reset link!')
        }

        if (password !== confirmPassword) {
            return setMessage("Passwords do not match!")
        }

        try {
            const res = await API.post('/auth/reset-password', {
                email,
                token,
                password,
                confirmPassword
            })

            if (res.data.success) {
                alert('Password reset successfully!')
                navigate('/login')
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to reset password!')
        }
    }

    return (
        <div className={style.container5}>
            <div className={style.PassBox}>
                <img src="./src/assets/footLogo.png" alt="logo" />
                {message && <div className={style.message}>{message}</div>} 
                <h2>Create New Password</h2>
                <p>Enter a new password to reset the old password!</p>
                <form onSubmit={handleSubmit} method="post">
                    <div className={style.digitInput}>
                        <input 
                            type="password" 
                            placeholder='Enter new password...' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder='Confirm password...' 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit">Submit New Password</button>
                </form>
            </div>
        </div>
    )
}

import style from './otp.module.css'
import API from '../../api/axios'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function OTP() {
    const [otp, setOtp] = useState('')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const email = searchParams.get('email')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return alert('Email is missing in the link!')

        try {
            setLoading(true)
            const res = await API.post('/auth/verify-email', { email, otp })
            if (res.data.success) {
                alert('Email verified!')
                navigate('/login')
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Verification failed!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={style.container5}>
            <div className={style.otpBox}>
                <img src="./src/assets/footLogo.png" alt="logo" />
                <h1>OTP Verification</h1>
                <p>Please enter the 6-digit OTP code which was sent to <strong>{email}</strong></p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        maxLength={6}
                        inputMode="numeric"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>
            </div>
        </div>
    )
}

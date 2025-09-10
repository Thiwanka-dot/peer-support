import style from './forgotpass.module.css'
import API from '../../api/axios'
import { useState } from 'react'

export default function ForgotPass() {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await API.post('/auth/request-reset', {email})
            if(res.data.success) {
                alert('Reset link sent! Please check your email!')
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to send reset email!"
            alert(message)
        }
    }
    return (
        <div className={style.container5}>
            <div className={style.PassBox}>
                <img src="./src/assets/footLogo.png" alt="logo" />
                <h2>Forgot your password?</h2>
                <p>Enter your email to get the password reset link!</p>
                <form action="" onSubmit={handleSubmit} method="post">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit">Send Email</button>
                </form>
            </div>
        </div>
    )
}
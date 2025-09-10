import style from './login.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login(){
    const { login } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const result = await login(email, password);
        if(result.success){
            setMessage('Login successful!');
            if(result.type === 'admin'){
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } else {
            setMessage(result.message);
        }
    }

    return (
        <div className={style.container}>
            <img src="./src/assets/form.jpg" alt="formImage" />
            <div className={style.formStr}>
                {message && <div className={style.message}>{message}</div>} 
                <h1>Account Sign-In</h1>
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <label>Password:</label>
                    <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <em><Link to="/forgot-password">Forgot Your Password?</Link></em>
                    <button type="submit">Login</button>
                    <p>New Here? <em><Link to="/register">Create Account</Link></em></p>
                </form>
            </div>
        </div>
    )
}

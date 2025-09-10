import style from './register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        name: '',
        email: '',
        dob: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        // Age validation
        const today = new Date();
        const dob = new Date(form.dob);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 16) {
            setMessage("You must be at least 16 years old to register.");
            return;
        }

        // Password match
        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        // Check if email already exists
        try {
            const res = await fetch(`http://localhost:5000/api/auth/check-email?email=${form.email}`, {
                method: 'GET',
                credentials:'include',
            });
            const data = await res.json();
            if (data.exists) {
                setMessage("This email is already registered. Please login or use another email.");
                return;
            }
        } catch (err) {
            console.error("Email check failed:", err);
            setMessage("Failed to check email. Please try again.");
            return;
        }

        // Submit registration
        const result = await register(form);
        if (result.success) {
            setMessage('Registered successfully! Check your email for OTP verification.');
            navigate(`/otp?email=${form.email}`);
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div className={style.container}>
            <img src="./src/assets/form.jpg" alt="formImage" />
            <div className={style.formStr}>
                {message && <div className={style.message}>{message}</div>} {/* Display message */}
                <h1>Create an Account</h1>                
                <form onSubmit={handleSubmit} method='post'>
                    <label>Name:</label>
                    <input type="text" name="name" onChange={handleChange} />
                    <div className={style.inpDivide}>
                        <div className={style.inpPart}>
                            <label>Email:</label>
                            <input type="email" name="email" onChange={handleChange} />
                        </div>
                        <div className={style.inpPart}>
                            <label>Date of Birth:</label>
                            <input type="date" name="dob" onChange={handleChange} />
                        </div>
                    </div>
                    <div className={style.inpDivide}>
                        <div className={style.inpPart}>
                            <label>Password:</label>
                            <input type="password" name="password" onChange={handleChange} />
                        </div>
                        <div className={style.inpPart}>
                            <label>Confirm Password:</label>
                            <input type="password" name="confirmPassword" onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit">Register</button>
                    <p>Already have an account? <em><Link to="/login">Login</Link></em></p>
                </form>
            </div>
        </div>
    );
}

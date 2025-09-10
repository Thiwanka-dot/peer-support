import style from './footer.module.css'
import { FaLinkedin, FaFacebookSquare, FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer>
            <div className={style.footerLinks}>
                <div className={style.footInfo}>
                    <img src="./src/assets/footLogo.png" alt="Logo" />
                    <p>Feel free to engage, express, and evolve with others by communicating and posting content</p>
                    <button><Link to="/login">Join Now</Link></button>
                </div>
                <div className={style.links}>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/features">Features</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className={style.social}>
                    <h3>Social Media</h3>
                    <ul>
                        <li><a href="#"><FaLinkedin size={30} fill='#00C4EE' /></a></li>
                        <li><a href="#"><FaFacebookSquare size={30} fill='#00C4EE' /></a></li>
                        <li><a href="#"><FaInstagram size={30} fill='#00C4EE' /></a></li>
                    </ul>
                </div>
            </div>
            <div className={style.separator}></div>
            <div className={style.copy}>Copyright 2025. Thiwanka Dissanayake. All Rights Reserved.</div>
        </footer>
    )
}
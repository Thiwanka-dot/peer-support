import { useState } from 'react';
import style from './navigation.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, userType, logout } = useAuth();
    const navigate = useNavigate();

    const handleMenuToggle = () => setMenuOpen(!menuOpen);
    const handleCloseMenu = () => setMenuOpen(false);

    const handleDashboard = () => {
        if (userType === "admin") {
            navigate("/admin");
        } else {
            navigate("/user");
        }
        handleCloseMenu();
    };

    return (
        <nav>
            <div className={style.logo}>
                <Link to="/">
                    <img src="./src/assets/logo.png" alt="logo" />
                </Link>
            </div>
            <div
                className={style.hamburger}
                onClick={handleMenuToggle}
                aria-label="Open menu"
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter') handleMenuToggle(); }}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={style.navBtns}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/features">Features</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
                <div className={style.accBtns}>
                    {user ? (
                        <>
                            <button className={style.logBtn} onClick={handleDashboard}>Dashboard</button>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className={style.logBtn}><Link to="/login">Login</Link></button>
                            <button><Link to="/register">Register</Link></button>
                        </>
                    )}
                </div>
            </div>
            <div className={`${style.sideMenu} ${menuOpen ? style.open : ''}`}>
                <button
                    className={style.closeBtn}
                    onClick={handleCloseMenu}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '4rem',
                        cursor: 'pointer'
                    }}
                    aria-label="Close menu"
                >
                    &times;
                </button>
                <ul>
                    <li><Link to="/" onClick={handleCloseMenu}>Home</Link></li>
                    <li><Link to="/about" onClick={handleCloseMenu}>About</Link></li>
                    <li><Link to="/features" onClick={handleCloseMenu}>Features</Link></li>
                    <li><Link to="/contact" onClick={handleCloseMenu}>Contact</Link></li>
                </ul>
                <div className={style.accBtns}>
                    {user ? (
                        <>
                            <button className={style.logBtn} onClick={handleDashboard}>Dashboard</button>
                            <button onClick={() => { logout(); handleCloseMenu(); }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className={style.logBtn}><Link to="/login" onClick={handleCloseMenu}>Login</Link></button>
                            <button><Link to="/register" onClick={handleCloseMenu}>Register</Link></button>
                        </>
                    )}
                </div>
            </div>
            {menuOpen && (
                <div
                    className={`${style.backdrop} ${menuOpen ? style.show : ''}`}
                    onClick={handleCloseMenu}
                ></div>
            )}
        </nav>
    );
}

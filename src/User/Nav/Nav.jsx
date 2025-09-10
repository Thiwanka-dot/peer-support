import style from './nav.module.css';
import { Link } from 'react-router-dom';
import { FaComments, FaHome, FaUserFriends, FaUsers } from 'react-icons/fa';
import Logout from '../../Components/Logout/Logout';

export default function Nav() {
    return (
        <div className={style.sideBar}>
            <div className={style.links}>
                <Link to="/">
                <img src="./src/assets/userLogo.png" alt="logo" />
                </Link>
                <Link to="/user">
                <FaHome className={style.icon} fill='#00C4EE' />
                <p>Home</p>
                </Link>
                <Link to="/community">
                <FaUsers className={style.icon} fill='#00C4EE' />
                <p>Community</p>
                </Link>
                <Link to="/peer">
                <FaUserFriends className={style.icon} fill='#00C4EE' />
                <p>Peer Find</p>
                </Link>
                <Link to="/chat">
                <FaComments className={style.icon} fill='#00C4EE' />
                <p>Chat</p>
                </Link>
            </div>
            {/* Logout button styled like links */}
            <button className={style.logOut}>
                <Logout className={style.icon} />
            </button>
        </div>
  );
}

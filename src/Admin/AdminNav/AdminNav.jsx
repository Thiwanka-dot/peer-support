import style from './adminNav.module.css';
import { Link } from 'react-router-dom';
import { FaComments, FaHome, FaUserFriends, FaUsers } from 'react-icons/fa';
import Logout from '../../Components/Logout/Logout';

export default function AdminNav() {
    return (
        <div className={style.sideBar}>
            <div className={style.links}>
                <Link to="/">
                    <img src="./src/assets/userLogo.png" alt="logo" />
                </Link>
                <Link to="/admin">
                    <FaHome className={style.icon} fill='#00C4EE' />
                    <p>Home</p>
                </Link>
                <Link to="/admin-userList">
                    <FaUserFriends className={style.icon} fill='#00C4EE' />
                    <p>Users</p>
                </Link>
                <Link to="/admin-management">
                    <FaUsers className={style.icon} fill='#00C4EE' />
                    <p>Admins</p>
                </Link>
                <Link to="/admin-community">
                    <FaComments className={style.icon} fill='#00C4EE' />
                    <p>Communities</p>
                </Link>
            </div>
            <button className={style.logOut}>
                <Logout className={style.icon} />                
            </button>
        </div>
    );
}

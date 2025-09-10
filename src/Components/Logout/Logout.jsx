import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Logout({ className }) {
  const { logout } = useAuth();
  return (
    <>
      <FaSignOutAlt className={className} onClick={logout} />
      <p onClick={logout}>Logout</p>
    </>
  );
}

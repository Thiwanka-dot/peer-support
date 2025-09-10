import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import AdminNav from '../AdminNav/AdminNav';
import style from './userList.module.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Filtered search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={style.dashboard}>
      <AdminNav />
      <div className={style.content}>
        <div className={style.header}>
          <h2>User Management</h2>
        </div>
        <div className={style.userTable}>
          <div className={style.subContent}>
            <div className={style.userSearch}>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="search"
                  placeholder="Search user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">
                  <FaSearch />
                </button>
              </form>
            </div>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Verification</th>
                  <th>Peers Connected</th>
                  <th>Communities Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isVerified ? "Verified" : "Not Verified"}</td>
                    <td>
                      {user.peers && user.peers.length > 0
                        ? user.peers.map((p) => p.name).join(", ")
                        : "No peers"}
                    </td>
                    <td>
                      {user.communities && user.communities.length > 0
                        ? user.communities.map((c) => c.name).join(", ")
                        : "No communities"}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(user._id)}>
                        Delete User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import AdminNav from '../AdminNav/AdminNav';
import style from './adminManagement.module.css';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editData, setEditData] = useState({ id: '', name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/list', { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Create admin
const handleCreate = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await fetch("http://localhost:5000/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      fetchAdmins();
      setFormData({ name: "", email: "", password: "" });
      setMessage(data.message || "Admin created successfully");
    } else {
      setMessage(data.message || "Failed to create admin");
    }
  } catch (error) {
    console.error("Create admin error:", error);
    setMessage("Server error. Please try again.");
  }
};

  // Delete admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/admins/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        fetchAdmins();
      } else {
        alert(data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Open edit modal
  const handleEditOpen = (admin) => {
    setEditData({ id: admin._id, name: admin.name, email: admin.email, password: '' });
    setShowEditModal(true);
  };

  // Update admin
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage("")
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: editData.name, email: editData.email, password: editData.password }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdmins();
        setShowEditModal(false);
      } else alert(data.message || 'Failed to update admin');
    } catch (error) {
      console.error(error.message);
      setMessage("Error updating admin");
    }
  };

  return (
    <div className={style.dashboard}>
      <AdminNav />
      <div className={style.content}>
        <div className={style.header}>
          <h2>Admin Management</h2>
        </div>

        <div className={style.adminSection}>
          {/* Create Admin */}
          <div className={style.createAdmin}>
            {message && <div className={style.message}>{message}</div>}
            <h3>Create New Admin</h3>
            <form onSubmit={handleCreate}>
              <div className={style.intGrp}>
                <div className={style.intFld}>
                  <label htmlFor="name">Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className={style.intFld}>
                  <label htmlFor="email">Email:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className={style.intFld}>
                  <label htmlFor="password">Password:</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
              </div>
              <button type="submit">Create Admin</button>
            </form>
          </div>

          {/* Admin Table */}
          <div className={style.adminTable}>
            <h3>Existing Admins</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>
                        <div className={style.actionBtn}>
                          <button onClick={() => handleEditOpen(admin)} className={style.editBtn}>Edit</button>
                          <button onClick={() => handleDelete(admin._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>No admins found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div className={style.modalBackdrop}>
              <div className={style.modal}>
                <h2>Edit Admin</h2>
                <form className={style.form} onSubmit={handleEditSubmit}>
                  <div className={style.formInp}>
                    <label>Name:</label>
                    <input type="text" name="name" value={editData.name} onChange={handleEditChange} required />
                    <label>Email:</label>
                    <input type="email" name="email" value={editData.email} onChange={handleEditChange} required />
                    <label>Password (leave blank to keep current):</label>
                    <input type="password" name="password" value={editData.password} onChange={handleEditChange} />
                  </div>
                  <div className={style.modalBtns}>
                    <button type="submit" className={style.saveBtn}>Save</button>
                    <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

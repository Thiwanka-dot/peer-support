import { useEffect, useState } from 'react';
import AdminNav from '../AdminNav/AdminNav';
import style from './adminCommunity.module.css';

export default function AdminCommunity() {
  const [communities, setCommunities] = useState([]);
  const [formData, setFormData] = useState({ name: '', issueType: '', description: '' });
  const [editData, setEditData] = useState({ id: '', name: '', issueType: '', description: '' });
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/communities', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setCommunities(data.communities);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "issueType") {
      setFormData({ ...formData, issueType: e.target.value.split(',').map(s => s.trim()) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleEditChange = (e) => {
    if (e.target.name === "issueType") {
      setEditData({ ...editData, issueType: e.target.value.split(',').map(s => s.trim()) });
    } else {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };

  // Create community
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name.trim() || !formData.issueType || !formData.description.trim()) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        fetchCommunities();
        setFormData({ name: '', issueType: '', description: '' });
        setMessage(data.message || "Community created successfully");
      } else {
        setMessage(data.message || "Failed to create community");
      }
    } catch (error) {
      console.error(error.message);
      setMessage("Server error. Please try again.");
    }
  };


  // Delete community
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this community?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/communities/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        fetchCommunities();
      } else {
        setMessage(data.message || "Failed to delete community");
      }
    } catch (error) {
      console.error(error.message);
      setMessage("Server error. Could not delete community.");
    }
  };

  // Open edit modal
  const handleEditOpen = (community) => {
    setEditData({
      id: community._id,
      name: community.name,
      issueType: community.issueType,
      description: community.description
    });
    setShowEditModal(true);
  };

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage("")
    
    try {
      const res = await fetch(`http://localhost:5000/api/communities/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editData.name,
          issueType: editData.issueType,
          description: editData.description
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchCommunities();
        setShowEditModal(false);
      } else {
        alert(data.message || "Failed to update community");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={style.dashboard}>
      <AdminNav />
      <div className={style.content}>
        <div className={style.header}>          
          <h2>Community Management</h2>
        </div>
        <div className={style.community}>
          <div className={style.createCom}>
            {message && <div className={style.message}>{message}</div>}
            <h3>Create New Community</h3>
            <form onSubmit={handleCreate} method='post'>
              <div className={style.intGrp}>
                <div className={style.intFld}>
                  <label htmlFor="name">Community Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className={style.intFld}>
                  <label htmlFor="type">Issue Type:</label>
                  <input
                    type="text"
                    name="issueType"
                    value={Array.isArray(formData.issueType) ? formData.issueType.join(', ') : formData.issueType}
                    onChange={handleChange}
                    placeholder="e.g. Depression, ADHD"
                  />
                </div>
              </div>
              <div className={style.intFld}>
                <label htmlFor="description">Community Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
              </div>
              <button type="submit">Create Community</button>
            </form>
          </div>
          <div className={style.comTable}>
            <div className={style.subTable}>
              <h3>View Communities</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Issue Type</th>
                    <th>Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.length > 0 ? communities.map(com => (
                    <tr key={com._id}>
                      <td>{com.name}</td>
                      <td>{com.description}</td>
                      <td>{Array.isArray(com.issueType) ? com.issueType.join(', ') : com.issueType}</td>
                      <td>{com.members?.length || 0}</td>
                      <td>
                        <div className={style.actionBtn}>
                          <button onClick={() => handleEditOpen(com)} className={style.editBtn}>Edit</button>
                          <button onClick={() => handleDelete(com._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5}>No communities found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Edit Modal */}
            {showEditModal && (
              <div className={style.modalBackdrop}>
                <div className={style.modal}>
                  <h2>Edit Community Data</h2>
                  <form className={style.form} onSubmit={handleEditSubmit}>
                    <div className={style.formInp}>
                      <label>Community Name:</label>
                      <input type="text" name="name" value={editData.name} onChange={handleEditChange} />
                      <label>Issue Type:</label>
                      <input
                        type="text"
                        name="issueType"
                        value={Array.isArray(editData.issueType) ? editData.issueType.join(', ') : editData.issueType}
                        onChange={handleEditChange}
                        placeholder="e.g. Depression, ADHD"
                      />
                      <label>Description:</label>
                      <textarea name="description" value={editData.description} onChange={handleEditChange}></textarea>
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
    </div>
  );
}

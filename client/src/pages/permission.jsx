import React, { useEffect, useState } from "react";
import { FaSearch,  FaEdit, FaCamera} from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Permission = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [adminPassword, setAdminPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');



    const navigate = useNavigate();

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setAdminPassword('');
    };

    const handleEditUser = (userData) => {
        setEditUser(userData);
        setIsEditUserOpen(true);
      };      

    

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({
    user_id: '',
    firstname: '',
    lastname: '',
    password: '',
    role: '',
    });

        
      useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
      
          axios.get('http://localhost:3001/users', {
            headers: {
              'user-role': parsed.role
            }
          })
          .then(response => {
            setUsers(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error('There was an error fetching users!', error);
            setLoading(false);
          });
        }
      }, []);
      
    

        const handleConfirmToggle = async () => {
            if (!adminPassword) return;
          
            try {
              const res = await axios.post('http://localhost:3001/api/verify-admin-and-toggle-status', {
                admin_id: user.user_id,
                admin_password: adminPassword,
                target_user_id: selectedUser.user_id,
                new_status: selectedUser.status === 'active' ? 'inactive' : 'active'
              });
          
              if (res.data.success) {
                const updatedUsers = users.map(u =>
                  u.user_id === selectedUser.user_id
                    ? { ...u, status: selectedUser.status === 'active' ? 'inactive' : 'active' }
                    : u
                );
                setUsers(updatedUsers);
                setIsModalOpen(false);
              } else {
                alert(res.data.message || 'รหัสผ่านแอดมินไม่ถูกต้อง');
              }
            } catch (err) {
              console.error('Error updating status:', err);
            }
          };
          
        

        const handleSearch = (e) => {
            setSearchQuery(e.target.value.toLowerCase());
        };
        
    
        const filteredUsers = users.filter(user =>
            user.user_id.toString().includes(searchQuery) ||
            user.firstname.toLowerCase().includes(searchQuery) ||
            user.lastname.toLowerCase().includes(searchQuery) ||
            user.role.toLowerCase().includes(searchQuery)
        );


        const handleAddUserSubmit = async () => {

            if (newUser.password !== confirmPassword) {
                alert("Password and confirm password do not match.");
                return;
            }

            try {
              const formData = new FormData();

              
              formData.append('user_id', newUser.user_id);
              formData.append('firstname', newUser.firstname);
              formData.append('lastname', newUser.lastname);
              formData.append('password', newUser.password);
              formData.append('role', newUser.role);
              formData.append('image', newUser.image);
          
              await axios.post('http://localhost:3001/api/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
          
              setIsAddUserOpen(false);
              setNewUser({ user_id: '', firstname: '', lastname: '', password: '', role: '', image: null });
          
              const res = await axios.get('http://localhost:3001/users', {
                headers: { 'user-role': user.role }
              });
              setUsers(res.data);
          
            } catch (err) {
              console.error("Error adding user:", err);
              alert("Failed to add user.");
            }
        };


        const handleUpdateUser = async () => {
            try {
                const formData = new FormData();
                formData.append('firstname', editUser.firstname);
                formData.append('lastname', editUser.lastname);
                formData.append('role', editUser.role);

              if (editUser.image) {
                formData.append('image', editUser.image);
              }
              await axios.put(`http://localhost:3001/api/users/${editUser.user_id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
          
              setIsEditUserOpen(false);
          
              // refresh list
              const res = await axios.get('http://localhost:3001/users', {
                headers: { 'user-role': user.role }
              });
              setUsers(res.data);
          
            } catch (err) {
              console.error("Error updating user:", err);
              alert("Failed to update user.");
            }
        };

        const handleDeleteUser = async () => {
            try {
              const res = await axios.post(`http://localhost:3001/api/delete-user`, {
                admin_id: user.user_id,
                admin_password: deletePassword,
                target_user_id: editUser.user_id,
              });
          
              if (res.data.success) {
                alert("User deleted successfully.");
                setIsDeleteModalOpen(false);
                setIsEditUserOpen(false);
                const refreshed = await axios.get("http://localhost:3001/users", {
                  headers: { "user-role": user.role },
                });
                setUsers(refreshed.data);
              } else {
                alert(res.data.message || "Password incorrect");
              }
            } catch (err) {
              console.error("Error deleting user:", err);
              alert("Failed to delete user.");
            }
          };
          
          

          
          
    
        if (!user) {
            return <div>Loading...</div>;
        }

        if (!user) return <div>User data not found!</div>;

    return (
        <>
        <div className="main-container">
            <div className="box-container">
                <div className="profile-top">
                    <p>{user.firstname} {user.lastname}</p>
                    <div className="profile-pic" onClick={() => navigate('/profile')}>
                        <button>
                            <img
                                src={`/uploads/images/user_profile/${user.user_id}.png`}
                                alt="Profile"
                                onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'uploads/images/default-profile.jpg';
                                }}
                            />
                        </button>
                    </div>
                </div>
                <div className="permission-control">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search by ID, Name..." value={searchQuery} onChange={handleSearch}/>
                    </div>
                    {user.role === 'manager' && (
                    <div className="add-admin-button-container">
                        <button className="add-admin-button" onClick={() => setIsAddUserOpen(true)}>
                        + Create User
                        </button>
                    </div>
                    )}
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ID</th>
                            <th>Administrator group</th>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.user_id}>
                                <td>{index + 1}</td>
                                <td>{user.user_id}</td>
                                <td>{user.role}</td>
                                <td>{user.firstname} {user.lastname}</td>
                                <td>
                                    <div className={`button-switch ${user.status}`}>
                                        <button className={`status-toggle ${user.status}`} onClick={() => openModal(user)}>
                                            {user.status === 'active' ? 'ON' : 'OFF'}
                                        </button>

                                    </div>
                                </td>
                                <td className="action-buttons">
                                    <button className="edit-button" onClick={() => handleEditUser(user)}>
                                        <FaEdit /> Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            {isAddUserOpen && (
            <div className="modal-overlay">
                <div className="modal-box-user">
                <h3>Create New User</h3>

                <div className="user-input">
                    User ID
                    <input
                        type="text"
                        value={newUser.user_id}
                        onChange={(e) => setNewUser({ ...newUser, user_id: e.target.value })}
                    />
                </div>
                <div className="user-input">
                    Firstname
                    <input
                        type="text"
                        value={newUser.firstname}
                        onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
                    />
                </div>
                <div className="user-input">
                    Lastname
                    <input
                        type="text"
                        value={newUser.lastname}
                        onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
                    />
                </div>
                <div className="user-input">
                    Password
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                </div>
                <div className="user-input">
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="user-input">
                    Position
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="">- Select -</option>
                        <option value="admin">admin</option>
                        <option value="manager">manager</option>
                        <option value="ITfront">ITfront</option>
                        <option value="ITback">ITback</option>
                    </select>
                </div>
                <div className="user-input">
                    <input
                        className="input-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewUser({ ...newUser, image: e.target.files[0] })}
                    />
                </div>
            
                <div className="modal-actions">
                    <button onClick={() => setIsAddUserOpen(false)}>Cancel</button>
                    <button onClick={handleAddUserSubmit}>Confirm</button>
                </div>
                </div>
            </div>
            )}
            {isEditUserOpen && (
            <div className="modal-overlay">
                <div className="modal-box-user">
                <h3>Edit User</h3>

                <div className="profile-picture-edit">
                    <div className="profile-picture">
                        <img
                            src={
                                editUser.image
                                ? typeof editUser.image === "string"
                                    ? `/uploads/images/user_profile/${editUser.image}` // ถ้าเป็น path เดิมจาก DB
                                    : URL.createObjectURL(editUser.image) // ถ้าเพิ่งอัปโหลดใหม่
                                : `/uploads/images/user_profile/${editUser.user_id}.png` // fallback default จาก user_id
                            }
                            alt="Profile"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/uploads/images/default-profile.jpg';
                            }}
                        />
                    </div>
                    <label htmlFor="upload-edit-image" className="edit-icon">
                            <FaCamera />
                    </label>
                    <input
                        type="file"
                        id="upload-edit-image"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={(e) =>
                        setEditUser({ ...editUser, image: e.target.files[0] })
                        }
                    />
                </div>

                <div className="user-input">
                    User ID
                    <input
                    type="text"
                    value={editUser.user_id}
                    disabled
                    />
                </div>
                <div className="user-input">
                    Firstname
                    <input
                    type="text"
                    value={editUser.firstname}
                    onChange={(e) =>
                        setEditUser({ ...editUser, firstname: e.target.value })
                    }
                    />
                </div>
                <div className="user-input">
                    Lastname
                    <input
                    type="text"
                    value={editUser.lastname}
                    onChange={(e) =>
                        setEditUser({ ...editUser, lastname: e.target.value })
                    }
                    />
                </div>
                <div className="user-input">
                    Position
                    <select
                    value={editUser.role}
                    onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                    }
                    >
                    <option value="">- Select -</option>
                    <option value="admin">admin</option>
                    <option value="manager">manager</option>
                    <option value="ITfront">ITfront</option>
                    <option value="ITback">ITback</option>
                    </select>
                </div>

                <div className="modal-actions">
                    <button onClick={() => setIsEditUserOpen(false)}>Cancel</button>
                    {user.role === 'manager' && (
                        <button className="delete-user-button" onClick={() => setIsDeleteModalOpen(true)}>
                            Delete User
                        </button>
                    )}
                    <button onClick={handleUpdateUser}>Update</button>
                </div>
                </div>
            </div>
            )}


        </div>

        {isModalOpen && (
            <div className="modal-overlay">
            <div className="modal-box">
                <h3>Confirm Status Change</h3>
                <p>Please enter your admin password</p>
                <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin password"
                />
                <div className="modal-actions">
                <button onClick={() => setIsModalOpen(false)}>Cancle</button>
                <button onClick={handleConfirmToggle}>Confirm</button>
                </div>
            </div>
            </div>
        )}
        {isDeleteModalOpen && (
            <div className="modal-overlay">
                <div className="modal-box">
                <h3>Confirm User Deletion</h3>
                <p>Please enter your password to confirm</p>
                <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Manager password"
                />
                <div className="modal-actions">
                    <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                    <button onClick={handleDeleteUser}>Confirm Delete</button>
                </div>
                </div>
            </div>
            )}

    </>
    )
      
}
export default Permission;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaEdit } from "react-icons/fa";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="main-container">
            <div>
                <div className="profile-header">
                    <div className="profile-picture-container">
                        <div className="profile-picture">
                            <img
                                src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
                                alt="Profile"
                            />
                        </div>
                        <label htmlFor="upload-edit-image" className="edit-icon">
                            <FaCamera />
                        </label>
                    </div>
                    <div className="profile-info">
                        <h1>{user.firstname} {user.lastname}</h1>
                        <p>{user.role}</p>
                    </div>
                </div>

                <div className="profile-container">
                    <div className="profile-card">
                        <div className="edit-button-container">
                            <button id="edit-password-desktop" onClick={() => navigate("/passwordEdit")}>
                                <FaEdit  className="icon" />  EDIT
                            </button>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{user.firstname} {user.lastname}</td>
                                </tr>
                                <tr>
                                    <th>Password</th>
                                    <td>••••••••</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.firstname}@gmail.com</td>
                                </tr>
                                <tr>
                                    <th>Phone number</th>
                                    <td>0911233456</td>
                                </tr>
                            </tbody>
                        </table>
                        <button id="edit-password-moblie" onClick={() => navigate("/editUser")}>
                            EDIT
                        </button>
                        <div className="back-button-container">
                            <button className="back-button" onClick={() => navigate(-1)}>
                                BACK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

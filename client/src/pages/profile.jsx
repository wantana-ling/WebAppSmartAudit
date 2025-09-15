import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaEdit } from "react-icons/fa";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  if (!admin) return <div>Loading...</div>;

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
          </div>
          <div className="profile-info">
            <h1>{admin.company}</h1>
          </div>
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <table>
              <tbody>
                <tr>
                  <th>User ID</th>
                  <td>{admin.user_id}</td>
                </tr>
                <tr>
                  <th>Password</th>
                  <td>••••••••</td>
                </tr>
              </tbody>
            </table>

            <button
              id="edit-password-moblie"
              onClick={() => navigate("/editUser")}
            >
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
    <style>{`
    :root {
    --primary-color: #0018c7;
    --green-color: #22c55e;
    }
    /* ซ้ำ */
    .profile-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-bottom: 30px;
    }

    .profile-picture-container {
        position: relative;
        width: 150px;
        height: 150px;
    }

    .profile-picture {
        width: 150px;
        height: 150px;
        border-radius: 50%;
    }

    .profile-picture img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid #D7D7D7;
    }

    .edit-icon {
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: var(--primary-color);
        color: white;
        border-radius: 50%;
        padding: 6px;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Info */
    .profile-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .profile-info h1 {
        font-size: 28px;
        font-weight: 600;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .profile-info p {
        color: var(--primary-color);
        font-weight: 400;
        margin-top: 5px;
    }

    /* Card + Table */
    .profile-container {
        display: flex;
        justify-content: center;
    }

    .profile-card {
        position: relative;
        width: 100%;
        max-width: 420px;
        padding: 0;
        background: transparent;
        box-shadow: none;
        border-radius: 0;
    }

    .edit-button-container {
        position: absolute;
        top: -10px;
        right: 0;
    }

    #edit-password-desktop {
        padding: 4px 16px;
        border: none;
        border-radius: 5px;
        background-color: var(--green-color);
        color: white;
        cursor: pointer;
        font-size: 12px;
    }

    .profile-card table {
        table-layout: fixed;
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
    }

    .profile-card th {
        width: 40px;
        text-align: left;
        color: var(--primary-color);
        font-weight: 500;
        padding: 10px;
        white-space: nowrap;
        vertical-align: top;
    }

    .profile-card td {
        white-space: nowrap;
        overflow: hidden;
        color: #939393;
        font-size: 14px;
        padding: 10px 16px;
        line-height: 1.8;
    }

    /* Mobile */
    #edit-password-moblie {
        display: none;
    }

    @media (max-width: 768px) {

        .profile-header {
            flex-direction: column;
        }

        .edit-button-container {
            display: none;
        }

        #edit-password-desktop {
            display: none;
        }

        #edit-password-moblie {
            display: block;
            margin: 20px auto 0;
            padding: 6px 20px;
            background-color: var(--green-color);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 12px;
            cursor: pointer;
        }

        .profile-info h1 {
            font-size: 22px;
        }

        .profile-info p {
            font-size: 14px;
        }

        .profile-card th,
        .profile-card td {
            font-size: 13px;
            text-align: center;
        }
    }

    .back-button-container {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }

    .back-button {
      background-color: #f44336;
      color: white;
      padding: 10px 30px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .back-button:hover {
      background-color: #d32f2f;
    }
    `}</style>
    </div>
  );
};

export default Profile;

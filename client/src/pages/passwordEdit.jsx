import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PasswordEdit = () => {
    const [user, setUser] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);



    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!oldPassword) newErrors.oldPassword = "กรุณากรอกรหัสผ่านเดิม";
        if (!newPassword) newErrors.newPassword = "กรุณากรอกรหัสผ่านใหม่";
        if (!confirmPassword) newErrors.confirmPassword = "กรุณายืนยันรหัสผ่านใหม่";
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirmPassword = "รหัสผ่านใหม่ไม่ตรงกัน";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

       
        setErrors({});
        console.log("Submit:", { oldPassword, newPassword });

        fetch("http://localhost:3001/api/change-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              user_id: user.user_id,
              oldPassword,
              newPassword
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setIsSuccess(true);
            } else {
              setErrors({ oldPassword: data.message || "รหัสผ่านเดิมไม่ถูกต้อง" });
            }
          })
          
          .catch(err => {
            console.error("Error:", err);
          });
          
    };

//ไปหน้าก่อนหน้า

    const handleBack = () => {
        navigate(-1);
    };
    

    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }


    return (
        <div className="main-container">
            <div className="box-container">
                <button onClick={handleBack} className="back-button">
                    <FaArrowLeft /> Back
                </button>
                <form onSubmit={handleSubmit} className="password-form">
                <h2>Change Password</h2>
                <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                        <input
                            type={showOld ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowOld(!showOld)}>
                            {showOld ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}
                </div>

                <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                        <input
                            type={showNew? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowNew(!showNew)}>
                            {showNew ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.newPassword && <p className="error">{errors.newPassword}</p>}
                </div>

                <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowConfirm(!showConfirm)}>
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>

                <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}
export default PasswordEdit;
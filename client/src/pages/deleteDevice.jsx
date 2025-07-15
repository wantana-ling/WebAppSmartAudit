import React from "react";
import "../css/deleteDevice.css";

const DeleteModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null; // ✅ ถ้ายังไม่สั่งเปิด modal จะไม่ render อะไรเลย

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">❗</div>
        <h3 className="modal-title">Are You Sure ?</h3>
        <p className="modal-text">
          This device will be lost.<br />This device cannot be reversed.
        </p>
        <div className="modal-buttons">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

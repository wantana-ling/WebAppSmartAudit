// DeleteModal.jsx
import React from "react";
import "../css/deleteUserManagement.css";

const DeleteModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">❗</div>
        <h3 className="modal-title">Are You Sure ?</h3>
        <p className="modal-text">
          All account data will be lost.<br />This action cannot be reversed.
        </p>
        <div className="modal-buttons">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    <style>{`
      
    
    
    
    `}</style>
    </div>
  );
};

export default DeleteModal;

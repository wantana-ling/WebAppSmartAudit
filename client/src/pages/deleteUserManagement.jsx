// DeleteModal.jsx
import React from "react";

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
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }

    .modal-box {
      background: #fff;
      padding: 30px 40px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
      min-width: 300px;
      max-width: 400px;
    }

    .modal-icon {
      font-size: 36px;
      color: red;
      margin-bottom: 15px;
    }

    .modal-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .modal-text {
      font-size: 14px;
      color: #333;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .modal-buttons {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    .modal-btn {
      flex: 1;
      padding: 10px;
      font-size: 14px;
      font-weight: bold;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .modal-btn.cancel {
      background: #ccc;
      color: black;
    }

    .modal-btn.confirm {
      background: #ff4d4d;
      color: white;
    }
    `}</style>
    </div>
  );
};

export default DeleteModal;

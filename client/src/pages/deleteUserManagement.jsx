import React from "react";

const DeleteModal = ({ onCancel, onConfirm }) => {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30"
      onClick={onCancel}
    >
      <div
        className="w-[320px] rounded-2xl bg-white p-6 text-center shadow-2xl animate-[pop-in_0.2s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mb-3 flex justify-center">
          <div className="text-4xl text-red-500">❗</div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold">Are You Sure?</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          All account data will be lost.
          <br />
          This action cannot be reversed.
        </p>

        {/* Buttons */}
        <div className="mt-5 flex justify-around">
          <button
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-black hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[rgba(255,77,77,0.85)] px-4 py-2 text-sm font-medium text-white hover:bg-[rgba(255,77,77,0.7)] transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

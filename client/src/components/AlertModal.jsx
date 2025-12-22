import React from "react";
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

const AlertModal = ({ isOpen, onClose, type = "info", title, message }) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: FaCheckCircle,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
      titleColor: "text-green-800",
    },
    error: {
      icon: FaExclamationCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
      titleColor: "text-red-800",
    },
    warning: {
      icon: FaExclamationTriangle,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-100",
      titleColor: "text-yellow-800",
    },
    info: {
      icon: FaInfoCircle,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
      titleColor: "text-blue-800",
    },
  };

  const { icon: Icon, iconColor, iconBg, titleColor } = config[type] || config.info;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fade-in_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[400px] rounded-2xl bg-white p-6 md:p-8 text-center shadow-2xl border border-gray-100 animate-[pop-in_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center`}>
            <Icon className={`text-3xl ${iconColor}`} />
          </div>
        </div>

        {/* Title */}
        {title && (
          <h3 className={`mb-2 text-xl font-bold ${titleColor}`}>
            {title}
          </h3>
        )}

        {/* Message */}
        <div className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 whitespace-pre-wrap break-words">
          {message}
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            className={`rounded-xl px-6 py-2.5 text-sm font-semibold hover:shadow-lg transition-all duration-200 shadow-md ${
              type === "success"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                : type === "error"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                : type === "warning"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            }`}
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;


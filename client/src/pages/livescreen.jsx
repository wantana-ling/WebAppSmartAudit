import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LiveScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedUser } = location.state || {};

  const handleExit = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-md ring-1 ring-gray-200 p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-[#1B2880] text-center pb-4 border-b border-gray-200">
          Live Screen Viewer
        </h2>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 text-center text-gray-700">
          <div>
            <p className="font-medium text-sm text-gray-500">User ID</p>
            <p className="mt-1 text-lg font-semibold">{selectedUser?.userId}</p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Department</p>
            <p className="mt-1 text-lg font-semibold">
              {selectedUser?.department}
            </p>
          </div>
          <div>
            <p className="font-medium text-sm text-gray-500">Username</p>
            <p className="mt-1 text-lg font-semibold">
              {selectedUser?.username}
            </p>
          </div>
        </div>

        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-gray-200 mb-8">
          <video
            className="w-full h-full object-contain"
            controls
            src="http://localhost:3050/video/id_001_210825"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="flex-1 bg-[#0DA5D8] hover:bg-[#0da4d8da] text-white font-semibold py-2.5 rounded-lg transition-all"
            onClick={handleExit}
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveScreen;

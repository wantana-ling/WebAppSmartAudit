import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBuilding, FaIdCard, FaTimes, FaVideo } from "react-icons/fa";
import { VIDEO_SERVER_URL, MESSAGES, ROUTES } from '../constants';

const LiveScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedUser } = location.state || {};

  const handleExit = () => {
    navigate(ROUTES.ACTIVE_VISITOR);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-4">
      <div className="w-full max-w-[900px] rounded-lg bg-white shadow-md ring-1 ring-gray-200 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0DA5D8] to-[#1A2DAC] px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaVideo className="text-sm" />
              </div>
              <div>
                <h2 className="text-base font-bold">Live Screen Viewer</h2>
                <p className="text-xs text-white/80">Real-time screen monitoring</p>
              </div>
            </div>
            <button
              onClick={handleExit}
              className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200"
              aria-label="Close"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0DA5D8] to-[#1A2DAC] flex items-center justify-center">
                  <FaIdCard className="text-white text-xs" />
                </div>
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wide">User ID</p>
              </div>
              <p className="text-sm font-bold text-gray-800">{selectedUser?.userId || "N/A"}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaBuilding className="text-white text-xs" />
                </div>
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wide">Department</p>
              </div>
              <p className="text-sm font-bold text-gray-800 truncate" title={selectedUser?.department}>
                {selectedUser?.department || "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <FaUser className="text-white text-xs" />
                </div>
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wide">Username</p>
              </div>
              <p className="text-sm font-bold text-gray-800 truncate" title={selectedUser?.username}>
                {selectedUser?.username || "N/A"}
              </p>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden border border-gray-300 shadow-lg mb-4">
            <video
              className="w-full h-full object-contain"
              controls
              src={`${VIDEO_SERVER_URL}/video/id_001_210825`}
            />
            {!selectedUser && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <div className="text-center text-white">
                  <FaVideo className="text-3xl mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">{MESSAGES.NO_VIDEO_STREAM}</p>
                  <p className="text-xs text-gray-400 mt-1">{MESSAGES.NO_VIDEO_STREAM_DESC}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0DA5D8] to-[#1A2DAC] hover:from-[#0b8fc4] hover:to-[#15268f] text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              onClick={handleExit}
            >
              <FaTimes className="text-xs" />
              <span>{MESSAGES.EXIT_VIEWER}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScreen;

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
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-6xl rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden border border-gray-100 animate-[pop-in_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0DA5D8] to-[#1A2DAC] px-6 md:px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <FaVideo className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Live Screen Viewer</h2>
                <p className="text-sm text-white/80 mt-0.5">Real-time screen monitoring</p>
              </div>
            </div>
            <button
              onClick={handleExit}
              className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Close"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0DA5D8] to-[#1A2DAC] flex items-center justify-center">
                  <FaIdCard className="text-white text-sm" />
                </div>
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wide">User ID</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-800">{selectedUser?.userId || "N/A"}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaBuilding className="text-white text-sm" />
                </div>
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wide">Department</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-800 truncate" title={selectedUser?.department}>
                {selectedUser?.department || "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wide">Username</p>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-800 truncate" title={selectedUser?.username}>
                {selectedUser?.username || "N/A"}
              </p>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border-2 border-gray-300 shadow-2xl mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
            <video
              className="w-full h-full object-contain"
              controls
              src={`${VIDEO_SERVER_URL}/video/id_001_210825`}
            />
            {!selectedUser && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <div className="text-center text-white">
                  <FaVideo className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">{MESSAGES.NO_VIDEO_STREAM}</p>
                  <p className="text-sm text-gray-400 mt-2">{MESSAGES.NO_VIDEO_STREAM_DESC}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0DA5D8] to-[#1A2DAC] hover:from-[#0b8fc4] hover:to-[#15268f] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={handleExit}
            >
              <FaTimes className="text-sm" />
              <span>{MESSAGES.EXIT_VIEWER}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScreen;

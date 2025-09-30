import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LiveScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedUser } = location.state || {};

  const handleExit = () => {
    navigate(-1); // ย้อนกลับ
  };

  return (
    // <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
    //   <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
    //     {/* Title */}
    //     <div className="text-xl font-bold mb-6 text-center">
    //       Live Screen Viewer
    //     </div>

    //     {/* User Info Table */}
    //     <div className="flex flex-wrap justify-around gap-10 mb-6 text-base">
    //       <div className="min-w-[150px] text-center">
    //         <span className="font-semibold">User ID</span>
    //         <br />
    //         <br />
    //         {selectedUser?.userId}
    //       </div>
    //       <div className="min-w-[150px] text-center">
    //         <span className="font-semibold">Department</span>
    //         <br />
    //         <br />
    //         {selectedUser?.department}
    //       </div>
    //       <div className="min-w-[150px] text-center">
    //         <span className="font-semibold">Username</span>
    //         <br />
    //         <br />
    //         {selectedUser?.username}
    //       </div>
    //     </div>

    //     {/* Video */}
    //     <div className="w-full aspect-[25/10] bg-black border border-gray-300 rounded-lg mb-8 overflow-hidden">
    //       <video
    //         className="w-full h-full object-contain rounded"
    //         controls
    //         src="http://localhost:3050/video/id_001_210825"
    //       />
    //     </div>

    //     {/* Exit + Download */}
    //     <div className="text-center flex flex-col items-center gap-4">
    //       <button
    //         className="w-1/2 bg-sky-600 hover:bg-sky-400 text-white font-bold py-2 px-6 rounded transition-all duration-300"
    //         onClick={handleExit}
    //       >
    //         EXIT
    //       </button>
    //       <a
    //         href="http://localhost:3050/video/id_001_210825"
    //         download
    //         className="w-1/2 bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-6 rounded text-center transition-all duration-300"
    //       >
    //         ⬇ Download Video
    //       </a>
    //     </div>
    //   </div>
    // </div>
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
      lorem1000edwmqolkdmpqwkdwmqdklwqmdwq
    </div>
  );
};

export default LiveScreen;

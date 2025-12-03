import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  if (!admin) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10">
        {/* Profile Picture */}
        <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px]">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src={process.env.PUBLIC_URL + "/img/default-profile.jpg"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center md:text-left">
          <h1 className="text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-semibold text-gray-800 truncate max-w-[280px] md:max-w-full">
            {admin.company}
          </h1>
          <p className="text-[#0018c7] mt-1 text-xs sm:text-sm md:text-base">{admin.email || ""}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex justify-center w-full">
        <div className="relative w-full max-w-[280px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px]">
          <table className="w-full table-fixed border-collapse mt-4 sm:mt-5 md:mt-6">
            <tbody>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[#0018c7] font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base w-[100px] sm:w-[120px]">User ID</th>
                <td className="text-gray-500 text-xs sm:text-sm py-2 sm:py-2.5 md:py-3 px-3 sm:px-4">{admin.user_id}</td>
              </tr>
              <tr>
                <th className="text-left text-[#0018c7] font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base">Password</th>
                <td className="text-gray-500 text-xs sm:text-sm py-2 sm:py-2.5 md:py-3 px-3 sm:px-4">••••••••</td>
              </tr>
            </tbody>
          </table>

          {/* Back Button */}
          <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-500 text-white px-6 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3 rounded-lg text-sm sm:text-base font-medium shadow hover:bg-red-600 transition"
            >
              BACK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

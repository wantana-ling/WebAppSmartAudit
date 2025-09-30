import React from "react";

const CardsSection = ({ accessCount, dailyUse, visitorActive }) => {
  return (
    <div className="flex gap-5 flex-wrap">
      <div className="p-3 md:p-4 lg:px-8 lg:py-2 bg-white shadow-md rounded-2xl flex flex-col justify-start gap-5">
        Access Count: {accessCount} Times
      </div>
      <div className="p-3 md:p-4 lg:px-8 lg:py-2 bg-white shadow-md rounded-2xl flex flex-col justify-start gap-5">
        Daily Use: {dailyUse} Minutes
      </div>
      <div className="p-3 md:p-4 lg:px-8 lg:py-2 bg-white shadow-md rounded-2xl flex flex-col justify-start gap-5">
        Visitor Active: {visitorActive}
      </div>
    </div>
  );
};

export default CardsSection;

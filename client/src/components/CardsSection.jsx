import React from "react";

const CardsSection = ({ accessCount, dailyUse, visitorActive }) => {
    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <div className="card">Access Count: {accessCount} Times</div>
            <div className="card">Daily Use: {dailyUse} Minutes</div>
            <div className="card">Visitor Active: {visitorActive}</div>
        </div>
    );
};

export default CardsSection;

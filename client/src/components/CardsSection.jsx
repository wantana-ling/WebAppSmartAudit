import React from "react";

const CardsSection = ({ accessCount, dailyUse, visitorActive }) => {
    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            <div className="card">Access Count: {accessCount} Times</div>
            <div className="card">Daily Use: {dailyUse} Minutes</div>
            <div className="card">Visitor Active: {visitorActive}</div>
        <style>{`
        .card {
            padding: 10px 30px 10px 30px;
            background-color: white;
            box-shadow: 0 4px 8px 0 rgb(0, 0, 0,0.2);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 20px;
        }
        @media (max-width: 768px) {
        .card {
            padding: 15px;
            width: 100%;
            border-radius: 20px;
            }
        }
        `}</style>
        </div>
    );
};

export default CardsSection;

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const HistoryTimeline = ({ data }) => {
    return (
        <LineChart className='history-timeline' width={400} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="accessCount" stroke="#1A2DAC" />
        </LineChart>
    );
};

export default HistoryTimeline;

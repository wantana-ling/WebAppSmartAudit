import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Video = () => {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
        
        useEffect(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            axios.get('http://localhost:3001/sessions')
            .then(response => {
                setSessions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching sessions!', error);
                setLoading(false);
            });
        }, []);

        const handleSearch = (e) => {
            setSearchQuery(e.target.value.toLowerCase());
        };

        const handleDateFilter = (e) => {
            setDateFilter(e.target.value);
        };
    
        const filteredSessions = sessions.filter(session => {
            const matchesSearch =
                session.firstname.toLowerCase().includes(searchQuery) ||
                session.lastname.toLowerCase().includes(searchQuery);
            
            if (dateFilter) {
                const sessionDate = new Date(session.login_time).toISOString().split('T')[0];
                return matchesSearch && sessionDate === dateFilter;
            }
    
            return matchesSearch;
        });

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        };
    
        if (!user) {
            return <div>Loading...</div>;
        }

    return (
        <div className="main-container">
                    <div className="box-container">
                        <div className="search-box">
                            <div class="search-container">
                                <FaSearch className="search-icon" />
                                <input type="text" placeholder="Search by Username..." value={searchQuery} onChange={handleSearch}/>
                            </div>
                            <div className="date-filter">
                                <input type="date" value={dateFilter} onChange={handleDateFilter} lang="en-GB"/>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Date</th>
                                    <th>Time-in</th>
                                    <th>Time-out</th>
                                    <th>Video.mp4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSessions.map((session, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{session.firstname} {session.lastname}</td>
                                        <td>{formatDate(session.login_time).split(' ')[0]}</td>
                                        <td>{formatDate(session.login_time).split(' ')[1]}</td>
                                        <td>{formatDate(session.logout_time).split(' ')[1]}</td>
                                        <td>
                                            <a href={`http://localhost:3001/uploads/sessions${session.video_path}`} download target="_blank">
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
    )
}
export default Video;
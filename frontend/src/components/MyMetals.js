import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const MyMetals = () => {
    const [metals, setMetals] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyMetals = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/my-metalss`, {
                    headers: { Authorization: `Bearer ${token}`}
                });
                setMetals(response.data);
                setError("");
            } catch (error) {
                setError("Failed to fetch metals");
            }
        };
        fetchMyMetals();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>My Metals</h3>
            <ul>
                {metals.map((metal) => {
                    <li key={metal}>{metal}</li>
                })}
            </ul>
        </div>
    );

};

export default MyMetals;
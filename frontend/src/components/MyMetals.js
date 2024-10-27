import React, { useEffect, useState } from 'react';
import { getMyMetals } from '../api/apiService';

const MyMetals = () => {
    const [metals, setMetals] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyMetals = async () => {
            try {
                const myMetals = await getMyMetals();
                console.log(myMetals);
                setMetals(myMetals);
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
            {metals.length > 0 ? (
                <ul>
                    {metals.map((metal) => (
                        <li key={metal}>{metal}</li>
                    ))}
                </ul>
             ) : (
                <p>Loading data or no data available...</p>
            )}
        </div>
    );

};

export default MyMetals;
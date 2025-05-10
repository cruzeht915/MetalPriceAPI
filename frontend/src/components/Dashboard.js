import React, {useEffect, useState} from 'react';
import { getLatestPrices, getMyMetals, postRemoveMetal, postAddMetal, metals } from '../api/apiService';

const Dashboard = () => {
    const [prices, setPrices] = useState({});

    const [myMetals, setMyMetals] = useState([]);
    const setError = useState('')[1];

    useEffect(() => {
        fetchPrices();
    }, []);

    useEffect(() => {
        fetchMyMetals();
    }, []);

    const fetchPrices = async () => {
        const data = await getLatestPrices();
        setPrices(data);
        
    };

    const fetchMyMetals = async () => {
        try {
            const response = await getMyMetals();
            setMyMetals(response);
            setError("");
        } catch (error) {
            setError("Failed to fetch metals");
        }
    };

    const handleRemoveMetal = async (e) => {
        e.preventDefault();
        try {
            const remove = e.target.getAttribute("dataid");
            await postRemoveMetal(remove);
            fetchMyMetals();
            fetchPrices();
        } catch (e) {
            console.error("Error removing metal");
        }
    }

    const handleAddMetal = async (e) => {
        e.preventDefault();
        try {
            const add = e.target.elements.metalSelect.value;
            await postAddMetal(add);
            fetchMyMetals();
            fetchPrices();
        } catch (e) {
            console.error("Error adding metal");
        }
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <hr />
            <div>
                <h3>Latest Metal Prices</h3>
                {Object.keys(prices).length > 0 ? (
                    <ul style={{listStyleType: 'none'}}>
                        {Object.keys(prices).map((metal) => (
                            <li key={metal}>
                                {metals.find(met => met.value === metal)?.label}: {prices[metal].price} {prices[metal].unit}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading data or no data available...</p>
                )}
            </div>
            <div>
                <h3>My Metals</h3>
                {myMetals.length > 0 ? (
                    <ul style={{listStyleType: 'none'}}>
                        {myMetals.map((metal) => (
                            <li key={metal}>
                                {metals.find(met => met.value === metal)?.label}
                                <button dataid={metal} onClick={handleRemoveMetal}>Remove</button>
                            </li>
                            
                        ))}
                    </ul>
                ) : (
                    <p>Loading data or no data available...</p>
                )}
            </div>
            <div>
                <h3>Add Meatal: </h3>
                    <form onSubmit={handleAddMetal}>
                        <select name="metalSelect">
                            {metals.filter(met => !myMetals.includes(met.value)).map((metalOption) => (
                                <option key={metalOption.value} value={metalOption.value}>
                                    {metalOption.label}
                                </option>
                            ))}
                        </select>
                        <button type='submit'>Add</button>
                    </form>
            </div>
            
        </div>
    );
};

export default Dashboard;

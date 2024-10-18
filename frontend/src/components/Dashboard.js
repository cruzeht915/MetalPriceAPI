import React, {useEffect, useState} from 'react';
import { getLatestPrices } from '../api/apiService';

const Dashboard = () => {
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const fetchPrices = async () => {
            const data = await getLatestPrices();
            setPrices(data);
        };
        fetchPrices();
    }, []);
    return (
        <div>
            <h2>Latest Metal Prices</h2>
            {Object.keys(prices).length > 0 ? (
                <ul>
                    {Object.keys(prices).map((metal) => (
                        <li key={metal}>
                            {metal}: {prices[metal].price} {prices[metal].unit}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading data or no data available...</p>
            )}
        </div>
    );
};

export default Dashboard;

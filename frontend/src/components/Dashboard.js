import React, {useEffect, useState} from 'react';
import { getLatestPrices } from '../api/apiService';

const Dashboard = () => {
    const [prices, setPrices] = useState({});
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            const data = await getLatestPrices();
            setPrices(data);
            //setLoading(false);
        };
        fetchPrices();
    }, []);

    // if(loading) {
    //     return <p>Loading prices...</p>;
    // }

    return (
        <div>
            <h2>Latest Metal Prices</h2>
            {Object.keys(prices).length > 0 ? (
                <ul style={{listStyleType: 'none'}}>
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

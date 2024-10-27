import React, {useEffect, useState} from 'react';
import { getHistoricalPrices, metals } from '../api/apiService';
import {Line} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
)

const HistoricalChart = () => {
    const [chartData, setChartData] = useState([]);
    const [range, setRange] = useState('last_week'); // Default range
    const [metal, setMetal] = useState('ALU'); // Default metal (Aluminum)

    useEffect(() => {
        const fetchHistoricalPrices = async () => {
            const data = await getHistoricalPrices(metal, range);
            if (data) {
                data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                const labels = data.map(item => new Date(item.timestamp).toLocaleDateString());
                const prices = data.map(item => item.price);
                setChartData({
                    labels: labels,
                    datasets: [{
                        label: `${metal} Price`,
                        data: prices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false,
                    }]
                });
            }
        };
        fetchHistoricalPrices();
    }, [range, metal]);
    if(!(chartData && chartData.labels)){
        return <p>Loading chart...</p>;
    }
    
    return (
        <div>
            {/* Metal Selection Dropdown */}
            <label>Select Metal: </label>
                <select onChange={e=> setMetal(e.target.value)} value={metal}>
                    {metals.map((metalOption) => (
                        <option key={metalOption.value} value={metalOption.value}>
                            {metalOption.label}
                        </option>
                    ))}
                </select>
            
            {/* Range Selection Dropdown */}
            <label>Select Range:</label>
                <select onChange={e=> setRange(e.target.value)} value={range}>
                    <option value="last_week">Last Week</option>
                    <option value="last_two_weeks">Last Two Weeks</option>
                    <option value="last_month">Last Month</option>
                    <option value="last_two_months">Last Two Months</option>
                    <option value="last_four_months">Last Four Months</option>
                </select>

            {/* Historical Chart*/}
            <h2>Historical Metal Prices for {metal}</h2>
            <Line data={chartData}/>
        </div>
    );
};

export default HistoricalChart;
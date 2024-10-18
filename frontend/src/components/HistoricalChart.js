import React, {useEffect, useState} from 'react';
import { getHistoricalPrices } from '../api/apiService';
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

const HistoricalChart = ({metal, range}) => {
    const [chartData, setChartData] = useState([]);

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

    return chartData && chartData.labels? <Line data={chartData}/> : <p>Loading chart...</p>;
};

export default HistoricalChart;
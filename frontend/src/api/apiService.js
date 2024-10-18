import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

//Fetch latest prices
export const getLatestPrices = async () => {
    try {
        const response = await axios.get(`${API_URL}/prices/latest`);
        return response.data;
    } catch (error) {
        console.error("Error fetching latest prices: ", error);
        return null;
    }
}

//Fetch historical prices
export const getHistoricalPrices = async (metal, range) => {
    try {
        const response = await axios.get(`${API_URL}/prices/historical?metal=${metal}&range=${range}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching historical prices: ", error);
        return null;
    }
}
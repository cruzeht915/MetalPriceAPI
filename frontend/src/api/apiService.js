import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';
const token = localStorage.getItem('token');   


export const metals = [
    { value: 'ALU', label: 'Aluminum (ALU)' },
    { value: 'XPB', label: 'Lead (XPB)' },
    { value: 'XCU', label: 'Copper (XCU)' },
    { value: 'IRON', label: 'Iron (IRON)' },
    { value: 'XLI', label: 'Lithium (XLI)' },
    { value: 'NI', label: 'Nickel (NI)' },
    { value: 'ZNC', label: 'Zinc (ZNC)' },

];


//Fetch latest prices
export const getLatestPrices = async () => {
    if (!token) {
        console.error("No authentication token found. Please log in.");
        return {};
    }
    try {
        const response = await axios.get(`${API_URL}/prices/latest`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        
        console.error("Error fetching latest prices: ", error);
        return {};
    }
};

//Fetch historical prices
export const getHistoricalPrices = async (metal, range) => {
    try {
        const response = await axios.get(`${API_URL}/prices/historical?metal=${metal}&range=${range}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching historical prices: ", error);
        return [];
    }
};

export const postAlert = async ({metal, threshold, above, phone_number}) => {
    if (!token) {
        console.error("No authentication token found. Please log in.");
        return "No authentication token found. Please log in.";
    }
    if (!/^(\+1)?\d{10}$/.test(phone_number)) {
        return "Try a US phone number.";
    }
    try {
        const response = await axios.post(`${API_URL}/set-alert`,{
            metal,
            threshold,
            above,
            phone_number
        }, {
            headers: { Authorization: `Bearer ${token}`}
        });
        console.log(response.data);
        return response.data["message"];
    } catch (e) {
        console.error(e);
        return "Error posting alert!";
    }
};

export const getMyAlerts = async () => {
    if (!token) {
        console.error("No authentication token found. Please log in.");
        return [];
    }
    try {
        const response = await axios.get(`${API_URL}/my-alerts`, {
            headers: { Authorization: `Bearer ${token}`}
        });
        console.log(response.data);
        return response.data;
    } catch (e) {
        return "Error fetching your alerts";
    }
};

export const postLogin = async ({username, password}) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        console.log(response.data);
        localStorage.setItem('token', response.data.access_token);
        return "";
    } catch (error) {
        console.log(error.response);
        return "Login failed. Please check your credentials.";
    }
};

export const postRegister = async ({username, password}) => {
    try {
        await axios.post(`${API_URL}/register`, {
            username,
            password
        });
        return "Resgistration Successful! You can now log in.";
    } catch (error) {
        return "Resgistration failed. Try again with different credentials.";
    }
};

export const getMyMetals = async () => {
    if (!token) {
        console.error("No authentication token found. Please log in.");
        return [];
    }
    const response = await axios.get(`${API_URL}/my-metals`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
};
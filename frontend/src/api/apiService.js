import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';  

export const metals = [
    { value: 'ALU', label: 'Aluminum (ALU)' },
    { value: 'XPB', label: 'Lead (XPB)' },
    { value: 'XCU', label: 'Copper (XCU)' },
    { value: 'IRON', label: 'Iron (IRON)' },
    { value: 'XLI', label: 'Lithium (XLI)' },
    { value: 'NI', label: 'Nickel (NI)' },
    { value: 'ZNC', label: 'Zinc (ZNC)' },
    { value: 'XSN', label: 'Tin (XSN)' }

];


//Fetch latest prices
export const getLatestPrices = async () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("No authentication token found. Please log in.");
        return {};
    }
    try {
        const response = await axios.get(`${API_URL}/prices/latest`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        
        console.error("Error fetching latest prices: ", error);
        return {};
    }
};

export const getMyMetals = async () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("No authentication token found. Please log in.");
        return [];
    }
    const response = await axios.get(`${API_URL}/my-metals`, {
        headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
};

export const postAddMetal = async (add) => {
    const token = localStorage.getItem('token'); 
    if (!token) {
        return "No authentication token found. Please log in.";
    }
    try {
        const response = await axios.post(`${API_URL}/add-metals?add=${add}`, 
            {},
            {headers: { Authorization: `Bearer ${token}`}})
        return response.data["message"];

    } catch (e) {
        console.error("Failed to remove metal from MyMetals!", e);
        return "Failed to remove metal from MyMetals!";
    }
}

export const postRemoveMetal = async (remove) => {
    const token = localStorage.getItem('token'); 
    if (!token) {
        return "No authentication token found. Please log in.";
    }
    try {
        const response = await axios.post(`${API_URL}/remove-metals?remove=${remove}`, 
            {},
            { headers: { Authorization: `Bearer ${token}`}})
        return response.data["message"];

    } catch (e) {
        console.error("Failed to remove metal from MyMetals!", e);
        return "Failed to remove metal from MyMetals!";
    }
}

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

//Handle Alerts
export const postAlert = async ({metal, threshold, above, phone_number}) => {
    const token = localStorage.getItem('token'); 
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
        return response.data["message"];
    } catch (e) {
        console.error(e);
        return "Error posting alert!";
    }
};

export const postRemoveAlert = async (alertID) => {
    try {
        const response = await axios.post(`${API_URL}/remove-alert?alertID=${alertID}`);
        console.log(response.data["message"]);
    } catch (e) {
        console.error("Error fetching your alerts", e)
    }
}

export const getMyAlerts = async () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("No authentication token found. Please log in.");
        return [];
    }
    try {
        const response = await axios.get(`${API_URL}/my-alerts`, {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (e) {
        console.error("Error fetching your alerts")
        return [];
    }
};

//User Authorization
export const postLogin = async ({username, password}) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
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


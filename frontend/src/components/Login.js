import React, { useState } from 'react';
import { postLogin } from '../api/apiService';
import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login?username=${username}&password=${password}`);
            console.log(response.data.access_token)
            localStorage.setItem('token', response.data.access_token);
            setError('');
        } catch (error) {
            setError("Login failed. Please check your credentials.");
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder='Username'
                    required
                />
                <input 
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder='Password'
                    required
                />
                <button type="submit">Login</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
            
        </div>
    );
};

export default Login;
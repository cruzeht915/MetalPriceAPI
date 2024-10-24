import React, { useState } from 'react';
import { postRegister } from '../api/apiService';
import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/register`, {
                "username": username,
                "password": password
            });
            setMessage("Resgistration Successful! You can now log in.");
        } catch (error) {
            setMessage("Resgistration failed. Try again with different credentials.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                <button type='submit'>Register</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Register;
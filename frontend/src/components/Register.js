import React, { useState } from 'react';
import { postRegister } from '../api/apiService';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await postRegister({username, password});
            setMessage(response);
        } catch (e) {
            console.error("Failed Registration!");
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
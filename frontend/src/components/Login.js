import React, { useState } from 'react';
import { postLogin } from '../api/apiService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            const response = await postLogin({username, password});
            setError(response);
        } catch (e) {
            console.error("Failed Login!");
        }
    };
    
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
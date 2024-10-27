import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleLogout = async () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    return (
        <div>
            {token && <button onClick={handleLogout}>Logout</button>}
        </div>
    )
}

export default Logout;
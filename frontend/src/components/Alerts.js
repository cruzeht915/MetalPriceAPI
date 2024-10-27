import React, {useEffect, useState} from 'react';
import { postAlert, getMyAlerts, metals } from '../api/apiService'; 

const Alerts = () => {
    //const [alert, setAlert] = useState({});
    const [metal, setMetal] = useState("ALU");
    const [thresh, setThresh] = useState("0.0");
    const [above, setAbove] = useState(false);
    const [phone_number, setPN] = useState("");
    const [message, setMessage] = useState("");

    const handlePostAlert = async (e) => {
        e.preventDefault();
        try{
            const threshold = parseFloat(thresh);
            const response = await postAlert({metal, threshold, above, phone_number});
            setMessage(response);
        } catch (e) {
            console.error("Failed to create Alert!");
        }
    };

    const handleAbove = async (e) => {
        setAbove(e.target.value==="true");
    };

    return (
        <div>
            <h2>Alerts</h2>
            <hr />
            <h3>Set New Alert</h3>
            <form onSubmit={handlePostAlert}>
                <label>Select Metal: </label>
                    <select onChange={e=> setMetal(e.target.value)} value={metal}>
                        {metals.map((metalOption) => (
                            <option key={metalOption.value} value={metalOption.value}>
                                {metalOption.label}
                            </option>
                        ))}
                    </select>
                <br/>
                <label>Set Threshold: </label>
                    <input
                        type='text'
                        pattern='^\d+(\.\d+)?$'
                        value={thresh}
                        onChange={e => setThresh(e.target.value)}
                        placeholder='0.0'
                        required
                    />
                <br/>
                <label>
                    <input
                    type="radio"
                    name="isAbove"
                    value="true"
                    checked={above}
                    onChange={handleAbove}
                    /> Above
                </label>
                <label>
                    <input
                    type="radio"
                    name="isAbove"
                    value="false"
                    checked={!above}
                    onChange={handleAbove}
                    /> Below
                </label>
                <br/>
                <label>Phone Number: </label>
                    <input
                        type='text'
                        pattern='^(\+1)?\d{10}$'
                        value={phone_number}
                        onChange={e => setPN(e.target.value)}
                        placeholder='+19998887777'
                        required
                    />
                <br/>
                <button type='submit'>Create Alert</button>
                {message && <p style={{color: 'blue'}}>{message}</p>}
            </form>
        </div>
    );
};

export default Alerts;
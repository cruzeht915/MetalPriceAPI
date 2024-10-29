import React, {useEffect, useState} from 'react';
import { postAlert, getMyAlerts, postRemoveAlert, metals } from '../api/apiService'; 
import axios from 'axios';

const Alerts = () => {
    const [metal, setMetal] = useState("ALU");
    const [thresh, setThresh] = useState("0.0");
    const [above, setAbove] = useState(false);
    const [phone_number, setPN] = useState("");
    const [message, setMessage] = useState("");

    const [myAlerts, setMyAlerts] = useState([]);

    const handlePostAlert = async (e) => {
        e.preventDefault();
        try{
            const threshold = parseFloat(thresh);
            const response = await postAlert({metal, threshold, above, phone_number});
            setMessage(response);
            fetchMyAlerts();
        } catch (e) {
            console.error("Failed to create Alert!");
        }
    };

    const handleRemoveAlert = async (e) => {
        e.preventDefault();
        try {
            const alertID = e.target.getAttribute("dataid");
            await postRemoveAlert(alertID);
            fetchMyAlerts();
        } catch (e) {
            console.error(e);
        }
    }

    const fetchMyAlerts = async () => {
        try {
            const response = await getMyAlerts();
            setMyAlerts(response);
        } catch (e) {
            console.error("Failed to fetch your alerts!")
        }
    }

    useEffect(() => {
        fetchMyAlerts();
    }, []);

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
                    onChange={e => setAbove(e.target.value==="true")}
                    /> Above
                </label>
                <label>
                    <input
                    type="radio"
                    name="isAbove"
                    value="false"
                    checked={!above}
                    onChange={e => setAbove(e.target.value==="true")}
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
            <div style={{ height: '10vh' }} />
            
            <h3>My Alerts</h3>
            {myAlerts.length>0 ? (
                <ul>
                    {myAlerts.map((alert) => (
                        <li key={alert["id"]}>
                            Alert for {metals.find(met => met.value === alert["metal"])?.label} {alert["above"]? "Above": "Below"} {alert["price_threshold"]} USD/lb   
                            <button dataid={alert["id"]} onClick={handleRemoveAlert}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no alerts!</p>
            )}
        </div>
    );
};

export default Alerts;
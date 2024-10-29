import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HistoricalChart from './components/HistoricalChart';
import Alerts from './components/Alerts';
import Logout from './components/Logout';
import PrivateRoute, {isAuthenticated} from './components/AuthorizeRouts';

function App() {
  return (
     <div className="App">
      <header className="App-header">
        <h1>Cruz Metal Price Tracker</h1>
      </header>
      <main>
    <Router>
      <nav>
        <ul style={{listStyleType: 'none'}}>
          <li>
            <Link to='/login' >Login</Link>
          </li>
          <li>
            <Link to='/register' >Register</Link>
          </li>
          <li>
            <Link to='/historical-prices' >Historical Prices</Link>
          </li>
          <li>
            <Link to='/dashboard' >Dashboard</Link>
          </li>
          <li>
            <Link to='/alerts'>Alerts</Link>
          </li>
          <Logout />
        </ul>
      </nav>

      <Routes>
        <Route path='/register' element={Register()}/>
        <Route path='/login' element={Login()}/>
        <Route path='/historical-prices' element={HistoricalChart()}/>

        <Route 
          path='/dashboard' 
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>  
          }
        />
        <Route 
          path='/alerts' 
          element={
            <PrivateRoute>
              <Alerts/>
            </PrivateRoute>
          }
        />
        <Route exact path="/" element = {<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
      </main>
      <div style={{ height: '40vh' }} />
     </div>
     
  );
}

export default App;

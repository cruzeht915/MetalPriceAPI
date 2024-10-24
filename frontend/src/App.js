import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HistoricalChart from './components/HistoricalChart';
import MyMetals from './components/MyMetals';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// const PrivateRoute = ({component: Component, ...rest}) => {
//   return (
//     <Route
//       {...rest}
//       render = {(props) => 
//       isAuthenticated()? <Component {...props} /> : <Navigate to="/login" />
//       }
//     />
//   );
// };

function App() {
  return (
    // <div>
    //   <HistoricalChart/>
    // </div>
     <div className="App">
      <header className="App-header">
        <h1>Metal Price Tracker</h1>
      </header>
      <main>
    <Router>
      <nav>
        <ul>
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
            <Link to='/my-metals' >My Metals</Link>
          </li>
          <li>
            <Link to='/dashboard' >Latest Prices</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path='/register' element={Register()}/>
        <Route path='/login' element={Login()}/>
        <Route path='/historical-prices' element={HistoricalChart()}/>

        <Route path='/my-metals' element={MyMetals()}/>
        <Route path='/dashboard' element={Dashboard()}/>
        <Route exact path="/" element = {<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
      </main>
     </div>
  );
}

export default App;

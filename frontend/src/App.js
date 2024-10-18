import './App.css';
import React, {useState} from 'react';
import Dashboard from './components/Dashboard';
import HistoricalChart from './components/HistoricalChart';

function App() {
  const [range, setRange] = useState('last_week'); // Default range
  const [metal, setMetal] = useState('ALU'); // Default metal (Aluminum)

  const metals = [
    { value: 'ALU', label: 'Aluminum (ALU)' },
    { value: 'XPB', label: 'Lead (XPB)' },
    { value: 'XCU', label: 'Copper (XCU)' },
    { value: 'IRON', label: 'Iron (IRON)' }
];
  return (
    <div className="App">
      <header className="App-header">
        <h1>Metal Price Tracker</h1>
      </header>
      <main>
        <Dashboard />

        {/* Metal Selection Dropdown */}
        <label>Select Metal: </label>
        <select onChange={e=> setMetal(e.target.value)} value={metal}>
          {metals.map((metalOption) => (
            <option key={metalOption.value} value={metalOption.value}>
              {metalOption.label}
            </option>
          ))}
        </select>
        
        {/* Range Selection Dropdown */}
        <label>Select Range:</label>
        <select onChange={e=> setRange(e.target.value)} value={range}>
          <option value="last_week">Last Week</option>
          <option value="last_two_weeks">Last Two Weeks</option>
          <option value="last_month">Last Month</option>
          <option value="last_two_months">Last Two Months</option>
          <option value="last_four_months">Last Four Months</option>
        </select>

        {/* Historical Chart*/}
        <HistoricalChart metal={metal} range={range}/>
      </main>
    </div>
  );
}

export default App;

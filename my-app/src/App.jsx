import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Click the button to fetch data.');

  const fetchData = async () => {
    setMessage('Fetching data...');
    try {
      const response = await fetch('https://cz6tlba49h.execute-api.ap-northeast-1.amazonaws.com/lambda');
      const data = await response.json();
      setMessage(`Response: ${data.message}`);
    } catch (error) {
      setMessage('Error fetching data.');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vite + React + Lambda Example</h1>
        <button onClick={fetchData}>Fetch Data</button>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;

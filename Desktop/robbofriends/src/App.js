/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
} */

import React, { useState, useEffect } from 'react';
import CardList from "./CardList";    
import SearchBox from './SearchBox';
// import Scroll from './Scroll';

const App = () => {
  const [robots, setRobots] = useState([]);
  const [searchfield, setSearchfield] = useState('');

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        setRobots(users);
      } catch (error) {
        console.error('Error fetching robots:', error);
      }
    };

    fetchRobots();
  }, []);

const onSearchChange = (event) => {
  setSearchfield(event.target.value);
};

const filteredRobots = robots.filter(robot =>
  robot.name.toLowerCase().includes(searchfield.toLowerCase())
);

return (
  <div className='tc'>
    <h1>Robo Friends</h1>
    <SearchBox searchfield={searchfield} searchchange={onSearchChange} />
    <CardList robots={filteredRobots} />
  </div>
);
};

export default App;
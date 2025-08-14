import React, { useEffect, useState } from 'react';
import Header from './Component/Header';
import About from './Component/About';
import Project from './Component/Project';
import Contact from './Component/Contact';
import Contact from './Component/Contact';
import Contact from './Component/Contact';

function App() {
  const [robots, setRobots] = useState([]);
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users') // RoboFriends API data
      .then(response => response.json())
      .then(users => setRobots(users));
  }, []);

  return (
    <div>
      <Header />
      <About />
      <Project />

      <section style={{ padding: '10px' }}>
        <h2>My RoboFriends</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {robots.map(robot => (
            <div key={robot.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
              <img src={`https://robohash.org/${robot.id}?200x200`} alt={robot.name} />
              <h3>{robot.name}</h3>
              <p>{robot.email}</p>
            </div>
          ))}
        </div>
      </section>

      <Contact />
    </div>
  );
}

export default App;

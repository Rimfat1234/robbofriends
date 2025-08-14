import React from 'react';

const Header = () => {
  return (
    <header style={{ textAlign: 'center', padding: '20px', background: '#1a0881ff', color: '#fff' }}>
      <h1>My Portfolio</h1>
      <nav>
        <a href="#about" style={{ margin: '0 10px', color: 'white' }}>About</a>
        <a href="#projects" style={{ margin: '0 10px', color: 'white' }}>Projects</a>
        <a href="#contact" style={{ margin: '0 10px', color: 'white' }}>Contact</a>
        <a href="#contact" style={{ margin: '0 10px', color: 'white' }}>Learnmore</a>
        <a href="#contact" style={{ margin: '0 10px', color: 'white' }}>Services</a>
      </nav>
    </header>
  );
};

export default Header;

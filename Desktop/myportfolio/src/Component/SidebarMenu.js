import React, { useState } from "react";

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          background: "#0a192f",
          color: "white",
          border: "none",
          padding: "10px 15px",
          cursor: "pointer",
          zIndex: 1100
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        style={{
          height: "100vh",
          width: isOpen ? "200px" : "0",
          backgroundColor: "#0a192f",
          position: "fixed",
          top: 0,
          left: 0,
          overflowX: "hidden",
          transition: "0.3s",
          paddingTop: "60px"
        }}
      >
        {isOpen && (
          <>
            <a href="#about" style={linkStyle}>About</a>
            <a href="#projects" style={linkStyle}>Projects</a>
            <a href="#contact" style={linkStyle}>Contact</a>
            <a href="#learnmore" style={linkStyle}>Learn More</a>
            <a href="#services" style={linkStyle}>Services</a>
          </>
        )}
      </div>
    </div>
  );
}

const linkStyle = {
  display: "block",
  padding: "10px 20px",
  color: "white",
  textDecoration: "none"
};

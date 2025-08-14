import React from 'react';
import myPic from './nansoh.jpg'; // Make sure this file is in the 'src' folder

// Portfolio Data
const name = "Nansoh Kumkur Rimfat";
const github = "https://github.com/Rimfat1234";     // Replace with your GitHub link
const linkedin = "https://linkedin.com/in/nansoh";  // Replace with your LinkedIn link
const twitter = "https://twitter.com/yourhandle";    // Replace with your Twitter handle
const email = "nansohkumkrrimfat@gmail.com";                 // Replace with your email

const Portfolio = () => {
  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <img
        src={myPic}
        alt="Profile"
        style={{ width: '200px', height: '200px', borderRadius: '30%', marginBottom: '20px', objectFit: 'cover' }}
      />
      <h1>{name}</h1>

      <div style={{ marginTop: '20px' }}>
        <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
        <p><strong>GitHub:</strong> <a href={github} target="_blank" rel="noopener noreferrer">{github}</a></p>
        <p><strong>LinkedIn:</strong> <a href={linkedin} target="_blank" rel="noopener noreferrer">{linkedin}</a></p>
        <p><strong>Twitter:</strong> <a href={twitter} target="_blank" rel="noopener noreferrer">{twitter}</a></p>
      </div>
    </div>
  );
};

export default Portfolio;

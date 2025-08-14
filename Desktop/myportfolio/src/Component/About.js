import React from 'react';
import myImage from './nansoh.jpg';
 // place your image inside src/assets

const About = () => {
  return (
    <section id="about" style={{ padding: '20px', textAlign: 'center' }}>
      <img src={myImage} alt="c:\Users\stone\Desktop\my picturse\nansoh.jpg" style={{ width: '250px', 
        borderRadius: '50%' }} />
      <h1>ABOUT ME</h1>
      <h3>
        Hi, I’m Nansoh Kumkur Rimfat, from plataeu state university Bokkos,
         a passionate Computer
         Science student and aspiring 
        full-stack developer with skills in html,css, JavaScript, 
        React, and ethical hacking to further.
        
        
      </h3>
    </section>
  );
};

export default About;

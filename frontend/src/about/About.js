// SvgFadeIn.js
import React, { useState, useEffect } from 'react';
import './css/About.css'; // Import the CSS file
import architecture from './architecture.drawio.svg'; // Import the SVG

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a timeout to make the SVG visible after 0ms, effectively showing it immediately
    setTimeout(() => setIsVisible(true), 0);
  }, []);

  return (
    <div className={isVisible ? 'svg-container visible' : 'svg-container'}>
      {/* Display the SVG image */}
      <img src={architecture} alt="Icon" />
    </div>
  );
};

export default AboutPage;
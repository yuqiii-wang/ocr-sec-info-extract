import React, { useState, useEffect } from 'react';
import './css/LoadingDots.css'; // Import the CSS for styling

const LoadingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length === 3 ? '' : prevDots + '.'));
    }, 500); // Adjust the interval time if necessary
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-dots">
      Loading{dots}
    </div>
  );
};

export default LoadingDots;

import React, { useEffect, useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';

const ProgressBarComponent = ({subscribedTopic="progress_update"}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const socket = io(`${window.location.origin}`); // WebSocket server URL

  useEffect(() => {
    // Listen for WebSocket progress updates

    socket.on('connect', () => {
        console.log('WebSocket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
    });
    
    socket.on(subscribedTopic, (data) => {
      setProgress(data.progress);
      if (data.status === 'completed') {
        setStatus('Processing Completed!');
      }
    });

    // Cleanup listener on component unmount
    return () => socket.off(subscribedTopic);
  }, []);

  return (
    <div className="container mt-5">
      <h5>Processing Progress</h5>
        <ProgressBar now={progress} label={`${progress}%`} striped animated />
      <p className="mt-3">{status}</p>
    </div>
  );
};

export default ProgressBarComponent;

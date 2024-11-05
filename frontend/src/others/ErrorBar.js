import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';

const ErrorBar = ({ message, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Alert variant="danger" onClose={handleClose} dismissible>
      {message}
    </Alert>
  );
};

export default ErrorBar;
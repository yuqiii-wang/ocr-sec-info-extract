import React, { useState } from 'react';
import { Form, Row, Col, Image, Alert, CloseButton } from 'react-bootstrap';

const FileUploadComponent = () => {
  const [fileData, setFileData] = useState(null);
  const [fileFormData, setFileFormData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
        setError('Only image files are supported.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      setFileFormData(formData);
      setFileName(file.name);

      sendUploadFile();
  };

  const sendUploadFile = () => {
    
    fetch('http://localhost:5000/process/fileupload', {
        method: 'POST',
        body: fileFormData,
        mode: "cors"
        })
        .then((response) => response.json())
        .then((data) => {
          setError('');
        })
        .catch((error) => {
          // Handle error response
          setError('Failed to upload file. Please try again.');
          console.error('Error:', error);
        });
  }

  const handleInputFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        setFileData(file);
      handleFileUpload(file);
    }
  };

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        handleFileUpload(file);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
    setDragging(false);
  };

  const handleRemoveFile = () => {
    setFileData(null);
    setFileName('');
  };

  return (
    <div
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: dragging ? '2px dashed #0d6efd' : '2px solid transparent',
        borderRadius: '5px',
        transition: 'border 0.3s',
        position: 'relative',
      }}
    >
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Control type="file" onChange={handleInputFileUpload} />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      {fileData && (
        <Row className="mt-3" style={{ position: 'relative' }}>
          <Col xs={3}>
            <div style={{ position: 'relative' }}>
              <Image src={fileData} thumbnail />
              <CloseButton
                onClick={handleRemoveFile}
                style={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                }}
              />
            </div>
          </Col>
          <Col>
            <h5>{fileName}</h5>
          </Col>
        </Row>
      )}

      {!fileData && (
        <p className="text-center">
          Drag and drop a file here or click to upload.
        </p>
      )}
    </div>
  );
};

export default FileUploadComponent;

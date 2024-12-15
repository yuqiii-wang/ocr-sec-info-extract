import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import "./css/Config.css";

const ConfigClassifierDynamicExampleComponent = () => {

    const [trainingLabels, setTrainingLabels] = useState([]);
    const [trainingResults, setTrainingResults] = useState("");
    const [isOnClassifierTraining, setIsOnClassifierTraining] = useState(false);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);


  return (
    <Container fluid>
      <Row className="mt-3" style={{ position: 'relative' }}>
                {fileListData.length > 0 && fileListData.map((image, idx) => (
                    <Col xs={1} key={idx}>
                        <div style={{ position: 'relative' }}>
                            <Image src={image.src} thumbnail
                                onClick={(e) => handleImageZoomIn(e, image.src)}
                                style={{
                                    cursor: 'zoom-in',
                                    transition: 'transform 0.3s ease',
                                    display: 'inline-block'
                                }} />
                            <CloseButton
                                onClick={() => handleRemoveFile(image.name)}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>
                    </Col>
                ))}
            </Row>
    </Container>
  );
};

export default ConfigClassifierDynamicExampleComponent;
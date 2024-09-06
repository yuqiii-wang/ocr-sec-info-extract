import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Card } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";

const ImageReferenceDetail = ({image, onDelete}) => {
    const {solutionLoading, referenceImageResults} = useContext(GlobalAppContext);
    const [localReferenceImageResults, setLocalReferenceImageResults] = useState([])

    const [hover, setHover] = useState(false);
    
    useEffect(() => {
        if (referenceImageResults.length == 0) return; // If clicked is false, skip the effect

        const fetchData = async () => {
            setLocalReferenceImageResults(referenceImageResults);
        }
        fetchData();
                    
      }, [localReferenceImageResults]);

  return (
            <Row className='position-relative'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <Col md={8} >
            <Card>
                <Card.Img variant="top" src={image.src} />
            </Card>
            </Col>
            <Col md={4}>
                <p>json result. </p>
            </Col>
            {hover && (
        <div
          className="position-absolute"
          onClick={onDelete}
          style={{
            top: '5px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontWeight: 'bold', color: 'black' }}>&times;</span>
        </div>
      )}
            </Row>
  );
};

export default ImageReferenceDetail;

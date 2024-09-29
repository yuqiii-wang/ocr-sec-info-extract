import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Card } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";

const ImageReferenceDetail = ({image, key, onDelete}) => {
    const {solutionLoading, referenceImageResults,
        referenceOCRJsonResults, setReferenceOCRJsonResults,
        referenceCodeSepOffset
    } = useContext(GlobalAppContext);

    const [hover, setHover] = useState(false);

  return (
        <Row className='reference-detail'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <Col md={7} >
                <Card.Img className='reference-detail' src={image.src} />
            </Col>
            <Col md={4}>
                {referenceOCRJsonResults != "" 
                    ? (<pre>{referenceOCRJsonResults}</pre>)
                    : (<p>Empty results</p>)}
            </Col>
            {hover && (
        <Col md={1}
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
        </Col>
      )}
            </Row>
  );
};

export default ImageReferenceDetail;

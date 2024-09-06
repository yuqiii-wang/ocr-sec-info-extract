import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Card } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";
import ImageReferenceDetail from './ImageReferenceDetail';

const ImageReferenceDetails = () => {
    const {solutionLoading, referenceImageResults, setReferenceImageResults} = useContext(GlobalAppContext);
    const [localReferenceImageResults, setLocalReferenceImageResults] = useState([]);

    const handleDeleteRow = (imageName) => {
        setLocalReferenceImageResults(localReferenceImageResults.filter(image => image.name !== imageName));
        setReferenceImageResults(localReferenceImageResults.filter(image => image.name !== imageName));
        console.log(localReferenceImageResults);
    };
    
    useEffect(() => {
        if (referenceImageResults.length == 0) return; // If clicked is false, skip the effect

        const fetchData = async () => {
            setLocalReferenceImageResults(referenceImageResults);
        }
        fetchData();

      }, [localReferenceImageResults]);

  return (
    <React.Fragment >
      {solutionLoading ? (
        <Row className="justify-content-md-center">
          <Col md="6">
            <Spinner animation="border" />
          </Col>
        </Row>
      ) : (
        <Row>
          {localReferenceImageResults.map((image , index) => (
                <ImageReferenceDetail 
                image={image}
                key={image.name}
                onDelete={() => handleDeleteRow(image.name)} />
            ))}
        </Row>
      )}
    </React.Fragment>
  );
};

export default ImageReferenceDetails;

import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Card } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";
import ImageReferenceDetail from './ImageReferenceDetail';
import "./css/ocr_results.css";

const ImageReferenceDetails = () => {
    const {solutionLoading, referenceImageResults, referenceCodeSepOffset,
        setReferenceImageResults} = useContext(GlobalAppContext);

    const handleDeleteRow = (imageName) => {
        setReferenceImageResults(referenceImageResults.filter(image => image.name !== imageName));
        console.log(referenceImageResults);
    };

  return (
    <div >
      {solutionLoading ? (
        <Row className="justify-content-md-center">
          <Col md="6">
            <Spinner animation="border" />
          </Col>
        </Row>
      ) : (
        <div >
          {referenceImageResults.map((image , index) => (
            <ImageReferenceDetail
                image={image}
                key={image.name}
                onDelete={() => handleDeleteRow(image.name)} 
                />
            ))}
        </div>
      )}
    </div>
  );
};

export default ImageReferenceDetails;

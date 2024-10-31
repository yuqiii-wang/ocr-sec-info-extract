import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Card } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";
import ImageReferenceDetail from './ImageReferenceDetail';
import "./css/ocr_results.css";

const ImageReferenceDetails = () => {
    const {solutionLoading, referenceImageResults, referenceOCRJsonResults,
        setReferenceImageResults} = useContext(GlobalAppContext);

    const handleDeleteRow = (imageName) => {
        setReferenceImageResults(referenceImageResults.filter(image => image.name !== imageName));
        console.log(referenceImageResults);
    };

    const ImageReferenceDetailList = () => {
        // Ensure both lists are of the same length
        const maxLength = Math.min(referenceImageResults.length, referenceOCRJsonResults.length);
        
        // Create an array of components by mapping over the indices
        const pairedItems = Array.from({ length: maxLength }, (_, index) => (
            <ImageReferenceDetail
                key={index}
                image={referenceImageResults[index]}
                ocr_json={JSON.stringify(referenceOCRJsonResults[index], null, 2)}
                onDelete={() => handleDeleteRow(referenceImageResults[index].name)} 
            />
        ));
      
        return <div>{pairedItems}</div>;
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
          <ImageReferenceDetailList></ImageReferenceDetailList>
        </div>
      )}
    </div>
  );
};

export default ImageReferenceDetails;

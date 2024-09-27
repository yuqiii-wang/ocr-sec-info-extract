import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import FileUploadComponent from "./FileUpload";
import { extractResponseImages } from "../others/ImageHandlingUtils"
import {GlobalAppContext} from "../GlobalAppContext";
import './css/Input.css';

const InputComponent = () => {

    const { answerLoading, isMainAskDone, setAnswerLoading,
        referenceCodeSepOffset, thisFileUuid, thisFilepath,
        referenceImageResults, setThisFileUuid, setSummaryResults, 
        setIsMainAskDone, isOnInputShow, setThisFilepath,
        setIsOnInputShow, setReferenceImageResults,
        inputError, setInputError } = useContext(GlobalAppContext);

    const handlePostRequest = async (event) => {

        try {
            if (thisFileUuid === "" ) {
                setInputError("Not found a file to submit for OCR process.");
            }
            setAnswerLoading(true);
            const response = fetch("/process/submit", {
                method: 'POST',
                body: JSON.stringify({"filepath": thisFilepath}),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response == undefined) {
                    throw new Error("file upload response is null.");
                } else if (!response.ok) {
                    throw new Error('file upload response was not ok.');
                }
                return response.json();
            })
            .then( async (data) => {
                if (data.error != undefined) {
                    setInputError(data.error);
                } else if (data.zip_file !== null) {
                    const referenceResults = data;
                    const images = await extractResponseImages(referenceResults);
                    setReferenceImageResults(images);
                    console.log(referenceImageResults);
            }
            setAnswerLoading(false);
            })
            .catch((postErr) => {
            // Handle error response
            if (postErr == "") {
                postErr = "Image Process Error.";
            }
            setInputError(postErr);
            setAnswerLoading(false);
            });
        } catch (error) {
            setInputError(error);
        } finally {
            setIsMainAskDone(true);
            setThisFileUuid("");
            setThisFilepath("");
        }
  };

  return (
    <Container className={`"input-card ${isOnInputShow ? 'active' : ''}`}
    >
      <Row className="justify-content-start align-items-end" 
      style={{ height: `${Math.min(32, 12+referenceCodeSepOffset)}rem`, margin: "1%" }}>
              <Form >
              <Form.Label>Upload a file</Form.Label>
                <FileUploadComponent />
              </Form>
              {inputError && <Alert variant="danger" onClose={() => setInputError(null)} dismissible>{inputError}</Alert>}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop:"1%" }}>
                <Button variant="primary" type="submit" onClick={handlePostRequest} disabled={answerLoading}>
                    {answerLoading ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                        'Submit'
                    )}
                </Button>
              </div>
      </Row>
    </Container>
  );
};

export default InputComponent;

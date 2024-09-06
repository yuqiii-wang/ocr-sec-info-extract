import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import FileUploadComponent from "./FileUpload";
import {GlobalAppContext} from "../GlobalAppContext";
import './css/Input.css';

const InputComponent = () => {

    const { answerLoading, isMainAskDone, setAnswerLoading, referenceCodeSepOffset,
        setSummaryResults, setIsMainAskDone } = useContext(GlobalAppContext);

  const handlePostRequest = async () => {
    try {
        setAnswerLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/process/upload", {
        data: "Your request data here",
      });
      await new Promise(resolve => setTimeout(resolve, 200));
      setSummaryResults(response.data);
    } catch (error) {
      console.error("Error making POST request", error);
    } finally {
        setAnswerLoading(false);
        setIsMainAskDone(true);
    }
  };

  return (
    <Container className="input-card border rounded">
      <Row className="justify-content-start align-items-end" 
      style={{ height: `${Math.max(6.5, 12-referenceCodeSepOffset)}rem`, margin: "1%" }}>
        <Col >
              <Form style={{ flexGrow: 1 }}>
              <Form.Label>Upload a file</Form.Label>
                <FileUploadComponent />
              </Form>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop:"1%" }}>
                <Button variant="primary" type="submit" onClick={handlePostRequest} disabled={answerLoading}>
                    {answerLoading ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                        'Submit'
                    )}
                </Button>
              </div>
        </Col>
      </Row>
    </Container>
  );
};

export default InputComponent;

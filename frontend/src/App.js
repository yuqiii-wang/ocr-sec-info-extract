import "./App.css";
import TopNavBar from "./TopNavBar";
import InputComponent from "./input";
import ReferenceComponent from "./ocr_results";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { GlobalAppContext, GlobalAppContextManager } from "./GlobalAppContext";

function App() {


  return (
    <GlobalAppContextManager className="App">
      <TopNavBar />
      <Container fluid style={{ marginTop: "1%" }}>
        <ReferenceComponent></ReferenceComponent>
        <InputComponent></InputComponent>
      </Container>
    </GlobalAppContextManager>
  );
}

export default App;

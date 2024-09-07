import "./App.css";
import TopNavBar from "./TopNavBar";
import InputComponent from "./input";
import ReferenceComponent from "./ocr_results";
import ComponentSepLine from "./others/ComponentSepLine";
import CodeComponent from "./code";
import {TriangleLeftButton, TriangleRightButton} from "./others/CodeInputSwitchButtons";
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { GlobalAppContext, GlobalAppContextManager } from "./GlobalAppContext";

const InputOrCodeDisplayWrapper = () => {
    const { isOnInputShow, setIsOnInputShow } = useContext(GlobalAppContext);

  return (
    <div style={{display: "d-flex", justifyContent: 'flex-center'}}>
        {isOnInputShow ? (
            <TriangleRightButton></TriangleRightButton>
        ):(
            <TriangleLeftButton></TriangleLeftButton>
        )}
      <Container className="border rounded"
      style={{width: "100%"}}>
        {isOnInputShow ? 
            (<InputComponent></InputComponent>)
            :(<CodeComponent></CodeComponent>)
        }
      </Container>
      </div>
  );
}

export default InputOrCodeDisplayWrapper;

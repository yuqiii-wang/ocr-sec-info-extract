import "./App.css";
import TopNavBar from "./TopNavBar";
import InputComponent from "./input";
import ReferenceComponent from "./reference";
import ComponentSepLine from "./others/ComponentSepLine";
import CodeComponent from "./code";
import {TriangleLeftButton, TriangleRightButton} from "./others/CodeInputSwitchButtons";
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { GlobalAppContext, GlobalAppContextManager } from "./GlobalAppContext";

const InputOrCodeDisplayWrapper = () => {
    const { isOnInputShow, setIsOnInputShow } = useContext(GlobalAppContext);

  return (
      <Container className="border rounded">
        {isOnInputShow ? 
            (<InputComponent></InputComponent>)
            :(<CodeComponent></CodeComponent>)
        }
      </Container>
  );
}

export default InputOrCodeDisplayWrapper;

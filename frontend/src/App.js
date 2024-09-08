import "./App.css";
import TopNavBar from "./TopNavBar";
import ReferenceComponent from "./ocr_results";
import ComponentSepLine from "./others/ComponentSepLine";
import InputOrCodeDisplayWrapper from "./InputOrCodeDisplay";
import { TriangleLeftButton, TriangleRightButton } from "./others/CodeInputSwitchButtons";
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { GlobalAppContext, GlobalAppContextManager } from "./GlobalAppContext";

function App() {

    const { isOnInputShow, setIsOnInputShow } = useContext(GlobalAppContext);

    return (
        <React.Fragment>
            <TopNavBar />
            <ReferenceComponent></ReferenceComponent>
            <ComponentSepLine></ComponentSepLine>
            <div style={{ display: "d-flex", justifyContent: 'flex-center' }}>

                <InputOrCodeDisplayWrapper></InputOrCodeDisplayWrapper>

                {isOnInputShow ? (
                    <TriangleRightButton></TriangleRightButton>
                ) : (
                    <TriangleLeftButton></TriangleLeftButton>
                )}
            </div>

        </React.Fragment>
    );
}

export default App;

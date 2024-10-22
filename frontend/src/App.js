import "./App.css";
import TopNavBar from "./TopNavBar";
import ReferenceComponent from "./ocr_results";
import ComponentSepLine from "./others/ComponentSepLine";
import InputOrCodeDisplayWrapper from "./InputOrCodeDisplay";
import AuditChartByTimeCategory from "./audit/AuditChartByTimeCategory";
import { TriangleLeftButton, TriangleRightButton } from "./others/CodeInputSwitchButtons";
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { GlobalAppContext, GlobalAppContextManager } from "./GlobalAppContext";

function App() {

    const { isOnAuditPage } = useContext(GlobalAppContext);

    return (
        <React.Fragment>
            <TopNavBar />
            {isOnAuditPage ? (
                <AuditChartByTimeCategory></AuditChartByTimeCategory>
            ) : (
                <React.Fragment>
                    <ReferenceComponent></ReferenceComponent>
                    <ComponentSepLine></ComponentSepLine>
                    <InputOrCodeDisplayWrapper></InputOrCodeDisplayWrapper>
                </React.Fragment>)}
        </React.Fragment>);
}

export default App;

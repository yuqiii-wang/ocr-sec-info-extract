import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { useState, useContext, useEffect, useRef, useCallback, } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { GlobalAppContext } from "./GlobalAppContext";

import logo from "./logo.svg";

function TopNavBar() {

    const { setIsOnAuditPage, setIsOnAboutPage,
        setIsOnConfigClassifierPage, setIsOnConfigNERPage,
        setIsOnConfigHandlerPage
     } = useContext(GlobalAppContext);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleAuditClick = () => {
        setIsOnAuditPage(true);
        setIsOnAboutPage(false);
        setIsOnConfigClassifierPage(false);
        setIsOnConfigNERPage(false);
        setIsOnConfigHandlerPage(false);
    };

    const handleAboutClick = () => {
        setIsOnAboutPage(true);
        setIsOnAuditPage(false);
        setIsOnConfigClassifierPage(false);
        setIsOnConfigNERPage(false);
        setIsOnConfigHandlerPage(false);
    };

    const handleHomeClick = () => {
        setIsOnAuditPage(false);
        setIsOnAboutPage(false);
        setIsOnConfigClassifierPage(false);
        setIsOnConfigNERPage(false);
        setIsOnConfigHandlerPage(false);
    };

    const handleConfigSelect = (eventKey) => {
        setIsOnAuditPage(false);
        setIsOnAboutPage(false);
        if (eventKey === 'Classifier Training') {
            setIsOnConfigClassifierPage(true);
        } else if (eventKey === 'NER Engine Training') {
            setIsOnConfigNERPage(true);
        } else if (eventKey === 'Script Generator Setup') {
            setIsOnConfigHandlerPage(true);
        }
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home" onClick={handleRefresh}>
                    <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />{" "}
                </Navbar.Brand>
                <Navbar.Brand href="#home" onClick={handleRefresh}>AI to Scripts</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="" onClick={handleHomeClick}>Home</Nav.Link>
                        <NavDropdown title="Config" onSelect={handleConfigSelect}>
                                <NavDropdown.Item eventKey="Classifier Training">Classifier Training</NavDropdown.Item>
                                <NavDropdown.Item eventKey="NER Engine Training">NER Engine Training</NavDropdown.Item>
                                <NavDropdown.Item eventKey="Script Generator Setup">Script Generator Setup</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="" onClick={handleAuditClick}>Audit</Nav.Link>
                        <Nav.Link href="" onClick={handleAboutClick}>About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopNavBar;

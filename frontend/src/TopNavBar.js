import Container from "react-bootstrap/Container";
import React, { useState, useContext, useEffect, useRef, useCallback, } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { GlobalAppContext } from "./GlobalAppContext";

import logo from "./logo.svg";

function TopNavBar() {

    const { setIsOnAuditPage } = useContext(GlobalAppContext);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleAuditClick = () => {
        setIsOnAuditPage(true);
    };

    const handleHomeClick = () => {
        setIsOnAuditPage(false);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home" onClick={handleRefresh}>
                    <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />{" "}
                </Navbar.Brand>
                <Navbar.Brand href="#home" onClick={handleRefresh}>OCR to Scripts</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="" onClick={handleHomeClick}>Home</Nav.Link>
                        <Nav.Link href="audit" onClick={handleAuditClick}>Audit</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopNavBar;

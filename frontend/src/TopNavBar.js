import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import React, { useState, useContext, } from "react";
import AdminLogin from "./admin/index";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { GlobalAppContext } from "./GlobalAppContext";

import logo from "./logo.svg";

function TopNavBar() {

    const { setIsOnHomePage, setIsOnAuditPage, setIsOnAboutPage,
        setIsOnConfigClassifierPage, setIsOnConfigNERPage,
        setIsOnConfigHandlerPage, setIsOnConfigApprovalPage
     } = useContext(GlobalAppContext);

     const [isToShowAdminLogin, setIsToShowAdminLogin] = useState(false);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleAuditClick = () => {
        setIsOnHomePage(false);
        setIsOnAuditPage(true);
        setIsOnAboutPage(false);
        setIsOnConfigClassifierPage(false);
        setIsOnConfigNERPage(false);
        setIsOnConfigHandlerPage(false);
    };

    const handleAboutClick = () => {
        setIsOnHomePage(false);
        setIsOnAuditPage(false);
        setIsOnAboutPage(true);
        setIsOnConfigClassifierPage(false);
        setIsOnConfigNERPage(false);
        setIsOnConfigHandlerPage(false);
    };

    const handleHomeClick = () => {
        setIsOnHomePage(true);
        setIsOnAuditPage(false);
        setIsOnAboutPage(false);
        setIsOnConfigClassifierPage(false);
        setIsOnConfigNERPage(false);
        setIsOnConfigHandlerPage(false);
    };

    const handleConfigSelect = (eventKey) => {
        setIsOnHomePage(false);
        setIsOnAuditPage(false);
        setIsOnAboutPage(false);
        if (eventKey === 'Classifier Training') {
            setIsOnConfigClassifierPage(true);
            setIsOnConfigNERPage(false);
            setIsOnConfigHandlerPage(false);
            setIsOnConfigApprovalPage(false);
        } else if (eventKey === 'NER Engine Training') {
            setIsOnConfigClassifierPage(false);
            setIsOnConfigNERPage(true);
            setIsOnConfigHandlerPage(false);
            setIsOnConfigApprovalPage(false);
        } else if (eventKey === 'Script Generator Setup') {
            setIsOnConfigClassifierPage(false);
            setIsOnConfigNERPage(false);
            setIsOnConfigHandlerPage(true);
            setIsOnConfigApprovalPage(false);
        } else if (eventKey === 'Approval Setup') {
            setIsOnConfigClassifierPage(false);
            setIsOnConfigNERPage(false);
            setIsOnConfigHandlerPage(false);
            setIsOnConfigApprovalPage(true);
        }
    }

    const handleToShowAdminLogin = () => {
        setIsToShowAdminLogin(true);
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
                                <NavDropdown.Item eventKey="NER Engine Training">NER Engine Setup</NavDropdown.Item>
                                <NavDropdown.Item eventKey="Script Generator Setup">Script Generator Setup</NavDropdown.Item>
                                <NavDropdown.Item eventKey="Approval Setup">Approval Setup</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="" onClick={handleAuditClick}>Audit</Nav.Link>
                        <Nav.Link href="" onClick={handleAboutClick}>About</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={handleToShowAdminLogin}>Admin</Nav.Link>
                        <Nav.Link href="#home" onClick={handleRefresh} >Restart</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <AdminLogin isToShowAdminLogin={isToShowAdminLogin}
                        setIsToShowAdminLogin={setIsToShowAdminLogin}></AdminLogin>
        </Navbar>
    );
}

export default TopNavBar;

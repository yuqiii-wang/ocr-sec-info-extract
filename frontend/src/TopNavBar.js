import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "./logo.svg";

function TopNavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />{" "}
        </Navbar.Brand>
        <Navbar.Brand href="#home">QA-RLHF</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#search">Search</Nav.Link>
            <Nav.Link href="#audit">Audit</Nav.Link>
            <Nav.Link href="#training">Training</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;

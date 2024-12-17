import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";

const AdminLogin = ({ isToShowAdminLogin, setIsToShowAdminLogin }) => {
    const { isAdminUserLoginSuccess, setIsAdminUserLoginSuccess
    } = useContext(GlobalAppContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => setIsToShowAdminLogin(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = fetch('/admin/login', {
                method: 'POST',
                body: JSON.stringify({"username": username,
                                    "password": password
                }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response === undefined) {
                    throw new Error("response is undefined");
                } else if (!response.ok) {
                    throw new Error('response not ok');
                }
                return response.json();
            })
            .then( data => {
                if (data.success) {
                    setIsAdminUserLoginSuccess(true);
                    setError('');
                } else {
                    setError(response.data.message || 'Login failed');
                }
            })
            .catch((postErr) => {
                setError(postErr.message);;
            });
        } catch (error) {
            setError(error.message);;
        } finally {
            ;
        }
    };

    return (
        <React.Fragment>
            {
                isAdminUserLoginSuccess ? (
                    <Modal show={isToShowAdminLogin} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Admin Tasks</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-md-center">
                                <Col md={6}>
                                    <li ><a  href="flask/kibana/app/management/data/index_management/indices">Check DB</a></li>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                ) : (
                    <Modal show={isToShowAdminLogin} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Admin Login</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="justify-content-md-center">
                                <Col md={6}>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {isAdminUserLoginSuccess && <Alert variant="isAdminUserLoginSuccess">Login successful!</Alert>}
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="formUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="username"
                                                placeholder="Enter username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" className="mt-3">
                                            Login
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                )
            }
        </React.Fragment>
    );
};

export default AdminLogin;

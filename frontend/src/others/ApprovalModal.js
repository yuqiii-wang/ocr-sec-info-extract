import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ApprovalModal.css"

const ApprovalModal = ({ show, handleClose }) => {
    const {
        approvalTemplateId, setApprovalTemplateId
    } = useContext(GlobalAppContext);

    const [approvalEmailRecipientsJoinedStr, setApprovalEmailRecipientsJoinedStr] = useState('');
    const [approvalEmailRecipients, setApprovalEmailRecipients] = useState([]);
    const [regulationReferenceLinks, setRegulationReferenceLinks] = useState([]);
    const [approvalEmailTemplate, setApprovalEmailTemplate] = useState('');
    const [selectedComponent, setSelectedComponent] = useState('A');

    const handleSwitchApprovalPage = (event) => {
        setSelectedComponent(event.target.value);
    };

    useEffect(() => {
        try {
            const response = fetch("/config/load/approval?" + "approval_template_id=" + approvalTemplateId, {
                    method: 'GET',
                    mode: "cors",
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                })
                .then(response => {
                    if (response == undefined) {
                        throw new Error("Approval config loading response is null.");
                    } else if (!response.ok) {
                        throw new Error('Approval config loading response was not ok.');
                    }
                    return response.json();
                })
                .then((data) => {
                    setApprovalEmailRecipients(data.approval_email_recipients);
                    setRegulationReferenceLinks(data.regulation_reference_links);
                    setApprovalEmailTemplate(data.approval_email_template);
                    setApprovalEmailRecipientsJoinedStr(data.approval_email_recipients.join(";"));
                })
                .catch((postErr) => {
                    // Handle error response
                    if (postErr == "") {
                        postErr = "Approval error.";
                    }
                });
        } catch (error) {
            ;
        } finally {
            ;
        }
    }, []);

    const handleSend = (event) => {
        setApprovalTemplateId(-1);
        handleClose();
    }

    const adjustDynamicTextHeight = (event) => {
        event.target.style.height = 'auto'; // Reset height
        event.target.style.height = `${event.target.scrollHeight}px`; // Set new height
    };

    return (
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>Approval</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='approval-switch-header'>
                        <Form.Check
                            type="radio"
                            label={<h5>Request for approval</h5>}
                            value="A"
                            checked={selectedComponent === 'A'}
                            onChange={handleSwitchApprovalPage}
                        />
                        <Form.Check
                            type="radio"
                            label={<h5>Already obtained approval</h5>}
                            value="B"
                            checked={selectedComponent === 'B'}
                            onChange={handleSwitchApprovalPage}
                        />
                    </Form.Group>
                </Form>
                {selectedComponent === 'A' ? (
                    <React.Fragment>
                    <p>Need to first obtain approval, then submit on "Already obtained approval".</p>
                    <Form>
                        <Form.Group controlId="formInput">
                            <h6>Approval Email Recipients</h6>
                            <Form.Control
                                type="text"
                                value={approvalEmailRecipientsJoinedStr}
                                onChange={(e) => setApprovalEmailRecipientsJoinedStr(e.target.value)}
                                placeholder="Enter your text"
                            />
                            <h6><br />Approval Email Content:</h6>
                            <Form.Control
                                type="textarea"
                                value={approvalEmailTemplate}
                                onChange={(e) => {
                                    setApprovalEmailTemplate(e.target.value);
                                    adjustDynamicTextHeight(e);
                                }}
                                as="textarea"
                                rows={5}
                                style={{ resize: 'none', overflow: 'hidden' }} // Prevent manual resizing
                                placeholder="Enter your text"
                            />
                        </Form.Group>
                    </Form>
                    <div className='approval-email-btn'>
                        <Button variant="primary" onClick={handleClose}>
                            Send Email
                        </Button>
                    </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                    <p>Submit obtained approval proof, then "Submit" to proceed.</p>
                    <Form>
                        <Form.Group controlId="formInput">
                            <h6>Submit obtained approval proof, e.g., email</h6>
                            <Form.Control
                                type="file"
                                placeholder="Upload a file"
                            />
                            <h6><br />Add approval link</h6>
                            <Form.Control
                                type="text"
                                value=""
                                onChange={(e) => {
                                    setApprovalEmailTemplate(e.target.value);
                                }}
                                as="textarea"
                                rows={1}
                                style={{ resize: 'none', overflow: 'hidden' }} // Prevent manual resizing
                                placeholder="Copy your link here."
                            />
                        </Form.Group>
                    </Form>
                    </React.Fragment>
                )}
                <h6><br />Approval Regulation Reference Links:</h6>
                <ul>
                    {regulationReferenceLinks.map((key) => (
                        <li key={key}><a key={key} href={key}>{key}</a></li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                {selectedComponent === 'B' && (
                <Button variant="primary" onClick={handleSend}>
                    Submit
                </Button>
                )}
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ApprovalModal;

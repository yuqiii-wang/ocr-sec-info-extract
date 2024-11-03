import React, {useState, useEffect} from 'react';
import { Dropdown, DropdownButton, Row, Col, Form } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ConfigNERRegexComponent = ({nerTaskLabels, selectedNerTaskLabel, 
                        selectedNerItemLabel, 
                        selectedNerItemDetails}) => {

    const [isOnSwitchHandler, setIsOnSwitchHandler] = useState(false);

    const toggleIsOnSwitchHandler = () => {
        isOnSwitchHandler ? setIsOnSwitchHandler(false) : setIsOnSwitchHandler(true);
    }

    return (
        <React.Fragment>
            <h6>NER task: </h6>
            <DropdownButton id="dropdown-basic-button"
                title={selectedNerTaskLabel} onClick={toggleIsOnSwitchHandler}>
                    {nerTaskLabels.map((nerTaskLabel) => (
                        <Dropdown.Item href="" key={nerTaskLabel}>{nerTaskLabel}</Dropdown.Item>
                    ))}
            </DropdownButton>
            <br/>
                <Form>
                <Row className="mb-3">
                <Form.Group as={Col} controlId="formNERName">
                <Form.Label>NER Name</Form.Label>
                    <Form.Control
                        placeholder=""
                        as="textarea"
                        rows={1}
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="formFullRegex">
                <Form.Label>Full Regex</Form.Label>
                    <Form.Control
                        placeholder=""
                        as="textarea"
                        rows={1}
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="formValueRegex">
                <Form.Label>Value Regex</Form.Label>
                    <Form.Control
                        placeholder=""
                        as="textarea"
                        rows={1}
                    />
                </Form.Group>
                </Row>
                <Row className="mb-3">
                <ListGroup as={Col}>
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip id="button-tooltip">
                            Submit this file/image for OCR parsing
                        </Tooltip>
                    } >
                        <Form.Label>Value Mapping</Form.Label>
                    </OverlayTrigger>
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                </ListGroup>
                </Row>
                </Form>
        </React.Fragment>
    );

}

export default ConfigNERRegexComponent;
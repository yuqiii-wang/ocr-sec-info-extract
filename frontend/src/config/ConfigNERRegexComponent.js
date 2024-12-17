import React, {useState, useEffect} from 'react';
import { Dropdown, DropdownButton, Button, Row, Col, Form } from 'react-bootstrap';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ErrorBar from '../others/ErrorBar';
import { QuestionCircle } from 'react-bootstrap-icons';


const ConfigNERRegexComponent = ({nerTaskLabels,
                        selectedNerTaskLabel, 
                        selectedNerItemLabel, 
                        selectedNerItemDetails,
                    }) => {

    const [isOnSwitchHandler, setIsOnSwitchHandler] = useState(false);
    const [isOnEditing, setIsOnEditing] = useState(false);
    const [nerItemName, setNerItemName] = useState("");
    const [isValidTransformedNerItemDetailJson, setIsValidTransformedNerItemDetailJson] = useState(true);
    const [transformedNerItemDetailJson, setTransformedNerItemDetailJson] = useState("");
    const validKeys = new Set(['full_regex', 'val_regex', 'key_regex']);

    const toggleIsEditing = () => {
        isOnEditing ? setIsOnEditing(false) : setIsOnEditing(true);
    }
    const toggleIsOnSwitchHandler = () => {
        isOnSwitchHandler ? setIsOnSwitchHandler(false) : setIsOnSwitchHandler(true);
    }

    const transformNerItemDetailJson = (selectedNerItemDetails) => {
        const data_json = JSON.stringify(selectedNerItemDetails, null, 2).replace(/\\\\/g, '\\');
        setTransformedNerItemDetailJson(data_json);
    }

    const validateTransformedNerItemDetailJson = () => {
        let isValid = true;
        let transformedNerItemDetailJsonObj = { };
        const regex_escape = /[\\]/g;
        try {
            let transformedNerItemDetailJsonStr = transformedNerItemDetailJson.replace(regex_escape, "\\\\");
            transformedNerItemDetailJsonObj = JSON.parse(transformedNerItemDetailJsonStr);
        } catch (error) {
            console.log("err");
            setIsValidTransformedNerItemDetailJson(false);
            return false;
        }
        
        if (Object.keys(transformedNerItemDetailJsonObj).length !== validKeys.size) {
            setIsValidTransformedNerItemDetailJson(false);
            return false;
        }
        for (let key of Object.keys(transformedNerItemDetailJsonObj)) {
            if (!validKeys.has(key)) {
                isValid = isValid && false;
                console.log("err3");
                break;
            }
        }
        setIsValidTransformedNerItemDetailJson(isValid);
        return isValid;
    }

    const handleEditNerItemNameChange = (e) => {
        setNerItemName(e.target.value);
    }

    const handleEditChange = (e) => {
        setTransformedNerItemDetailJson(e.target.value);
    }

    const handleSaveNerRequest = () => {
        if (nerItemName === undefined || nerItemName === "AddNew" || nerItemName === "") {
            return;
        }
        try {
            const regex_escape = /[\\]/g;
            const response = fetch("/config/save/ner", {
                method: 'POST',
                body: JSON.stringify({ "nerTask": selectedNerTaskLabel,
                                    "nerTaskItem": nerItemName,
                                    "nerTaskItemDetails": transformedNerItemDetailJson.replace(regex_escape, "\\\\")
                 }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response === undefined) {
                    throw new Error("classifier config training response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config training response was not ok.');
                }
                return response.json();
            })
            .then( data => {

            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
                    postErr = "Image Process Error.";
                }
            });
        } catch (error) {
            ;
        } finally {
            ;
        }
    }

    const validateNerItemNameInput = () => {
        const regex = /[ \&]/;
        return !regex.test(nerItemName);
    };
    
    useEffect(() => {
        if (selectedNerItemLabel === "AddNew") {
            setNerItemName("");
            setIsOnEditing(true);
        } else {
            setIsOnEditing(false);
            setNerItemName(selectedNerItemLabel);
        }
        transformNerItemDetailJson(selectedNerItemDetails);
    }, [selectedNerItemDetails, selectedNerItemLabel]);

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
                    <Col md="4">
                        <Form.Group as={Col} controlId="formNERName">
                        <h6>NER Name</h6>
                            <Form.Control
                                value={nerItemName}
                                as="textarea"
                                rows={1}
                                disabled={!isOnEditing}
                                isInvalid={!validateNerItemNameInput()}
                                onChange={handleEditNerItemNameChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Input should not contain spaces.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                {selectedNerItemLabel && 

                <Row className="mb-3">
                    <Col md="8">
                        <Form.Group as={Col} controlId="formNERName">
                        <Form.Label>Regex to recognize NER
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id="tooltip-info">
                                    <div className='tooltip-content'>
                                    <p>full_regex searches matched text from whole msg.</p>
                                    <p>key_regex searches pattern from full_regex found items, and remove itself.</p>
                                    <p>val_regex searches pattern from full_regex found items with key_regex text removed.</p>
                                            </div>
                                    </Tooltip>}
                            >
                                <Button variant="link">
                                    <QuestionCircle size={24} />
                                </Button>
                            </OverlayTrigger>
                            </Form.Label>
                            <Form.Control
                                value={transformedNerItemDetailJson}
                                as="textarea"
                                rows={9}
                                disabled={!isOnEditing}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md="4" className='ner-regex-btn-container'>
                    {!isOnEditing? (
                        <Button variant='primary' onClick={toggleIsEditing}>
                            Edit
                        </Button>) : (
                            <Button variant='primary' onClick={() => {
                                                                    const isValid = validateTransformedNerItemDetailJson();
                                                                    isValid ? setIsOnEditing(false) : setIsOnEditing(true);
                                                                    isValid && handleSaveNerRequest();}
                            }>
                            Save
                        </Button>
                        )}
                    </Col>
                </Row>
                        }
            </Form>
            {!isValidTransformedNerItemDetailJson && 
                <ErrorBar message="Invalid Json of Regex and Transform Rules"></ErrorBar>
            }
        </React.Fragment>
    );

}

export default ConfigNERRegexComponent;
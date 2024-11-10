import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import TextItemList from '../others/TextItemList';
import "./css/Config.css";

const ConfigHandlerComponent = ({selectedNerTaskLabel,
    nerIsInUseSet, setNerIsInUseSet
}) => {

    const [isOnEditing, setIsOnEditing] = useState(false);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);
    const [preScripts, setPreScripts] = useState('');
    const [postScripts, setPostScripts] = useState('');
    const [populatedScripts, setPopulatedScripts] = useState('');
    const [duplicateKeys, setDuplicateKeys] = useState([]);
    const [allowedMergeDuplicateItems, setAllowedMergeDuplicateItems] = useState([]);
    const [transformLambda, setTransformLambda] = useState({});

    const toggleIsEditing = () => {
        isOnEditing ? setIsOnEditing(false) : setIsOnEditing(true);
    }

    const handleEditPreScriptsChange = (e) => {
        setPreScripts(e.target.value);
    }

    const handleEditPopulatedScriptsChange = (e) => {
        setPopulatedScripts(e.target.value);
    }

    const handleEditPostScriptsChange = (e) => {
        setPostScripts(e.target.value);
    }

    const handleEditTransformLambdaChange = (e) => {
        setTransformLambda(e.target.value);
    }

    const validateAndExtract = (populatedScripts) => {
        // Regular expression to match {{item_name}}
        const regex = /\{\{(\w+)\}\}/g;
        let matches = [];
        let match;
        let isThisValid = true;

        while ((match = regex.exec(populatedScripts)) !== null) {
          matches.push(match[1]);
        }

        const isValid = matches.every((itemName) => {
            const isThisTempValid = new RegExp(`\\{\\{${itemName}\\}\\}`).test(populatedScripts);
            isThisValid = isThisValid && isThisTempValid;
        });

        if (isValid) {
            const nerIsInUseSetMatches = new Set(matches);
            console.log(nerIsInUseSetMatches);
            setNerIsInUseSet(nerIsInUseSetMatches);
        } else {
            setNerIsInUseSet(new Set([]));
            console.log('Some items are not correctly formatted.');
        }
        return isValid;
    };

    const handleGetNerTaskScriptsRequest = (nertask) => {
        setIsOnEditing(false);
        if (nertask === '' || nertask === undefined) {
            return;
        }
        try {
            const response = fetch("/config/load/ner/task/scripts?" + "nertask=" + nertask, {
                method: 'GET',
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response == undefined) {
                    throw new Error("classifier config training response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config training response was not ok.');
                }
                return response.json();
            })
            .then( data => {
                const pre_scripts = data["pre_scripts"];
                const post_scripts = data["post_scripts"];
                const populated_scripts = data["populated_scripts"];
                const duplicate_keys = data["duplicate_keys"];
                const allowed_merge_duplicate_items = data["allowed_merge_duplicate_items"];
                const transform_lambda = data["transform_lambda"];
                setPreScripts(pre_scripts);
                setPostScripts(post_scripts);
                setPopulatedScripts(populated_scripts);
                setDuplicateKeys(duplicate_keys);
                setAllowedMergeDuplicateItems(allowed_merge_duplicate_items);
                const transform_lambda_str = JSON.stringify(transform_lambda, null, 2);
                setTransformLambda(transform_lambda_str);
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr == "") {
                    postErr = "Image Process Error.";
                }
                setLoadConfigClassifierError(postErr);
            });
        } catch (error) {
            setLoadConfigClassifierError(error);
        } finally {
            ;
        }
    }


    const handleSaveNerTaskScriptsRequest = (nertask) => {
        setIsOnEditing(false);
        if (nertask === '' || nertask === undefined) {
            return;
        }
        const regex_escape = /[\\]/g;
        const nertaskScriptConfigs = {
            "pre_scripts": preScripts,
            "post_scripts": postScripts,
            "populated_scripts": populatedScripts,
            "duplicate_keys": duplicateKeys,
            "allowed_merge_duplicate_items": allowedMergeDuplicateItems,
            "transform_lambda": transformLambda
        };
        try {
            const response = fetch("/config/save/ner/task/scripts", {
                method: 'POST',
                body: JSON.stringify({"nertask": nertask,
                                    "nertaskScriptConfigs": nertaskScriptConfigs
                }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response == undefined) {
                    throw new Error("classifier config training response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config training response was not ok.');
                }
                return response.json();
            })
            .then( data => {
                ;
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr == "") {
                    postErr = "Image Process Error.";
                }
                setLoadConfigClassifierError(postErr);
            });
        } catch (error) {
            setLoadConfigClassifierError(error);
        } finally {
            ;
        }
    }

    useEffect(() => {
        handleGetNerTaskScriptsRequest(selectedNerTaskLabel);
    }, [selectedNerTaskLabel]);

  return (
    <Container fluid>
      <Form>
        <Row className="mb-3">
            <Col md="10">
            <TextItemList listName="Duplicate Keys"
                        listItems={duplicateKeys}
                        setListItems={setDuplicateKeys}></TextItemList>
            <TextItemList listName="Merge Duplicate Items"
                        listItems={allowedMergeDuplicateItems}
                        setListItems={setAllowedMergeDuplicateItems}></TextItemList>
                <Form.Group as={Col} controlId="preScripts">
                <h6>Transform Rules</h6>
                    <Form.Control
                        value={transformLambda}
                        as="textarea"
                        rows={4}
                        disabled={!isOnEditing}
                        onChange={handleEditTransformLambdaChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Input should not contain spaces.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="preScripts">
                <h6>Pre Scripts</h6>
                    <Form.Control
                        value={preScripts}
                        as="textarea"
                        rows={2}
                        disabled={!isOnEditing}
                        onChange={handleEditPreScriptsChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Input should not contain spaces.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="postScripts">
                <h6>NER Populated Scripts</h6>
                    <Form.Control
                        value={populatedScripts}
                        as="textarea"
                        rows={6}
                        disabled={!isOnEditing}
                        onChange={handleEditPopulatedScriptsChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Input should not contain spaces.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="postScripts">
                <h6>Post Scripts</h6>
                    <Form.Control
                        value={postScripts}
                        as="textarea"
                        rows={2}
                        disabled={!isOnEditing}
                        onChange={handleEditPostScriptsChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Input should not contain spaces.
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col md="2" className='ner-script-edit-btn-container'>
            {!isOnEditing? (
                <Button variant='primary' onClick={toggleIsEditing}>
                    Edit
                </Button>) : (
                    <Button variant='primary' onClick={() => {const isValid = validateAndExtract();
                                                            isValid && toggleIsEditing();
                                                            isValid && handleSaveNerTaskScriptsRequest(selectedNerTaskLabel);}
                    }>
                    Save
                </Button>
            )}
            </Col>
        </Row>
        </Form>
    </Container>
  );
}

export default ConfigHandlerComponent;
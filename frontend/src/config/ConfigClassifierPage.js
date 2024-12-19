import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import ConfigClassifierDataSampleComponent from './ConfigClassifierDataSampleComponent';
import "./css/Config.css";

const ConfigClassifierPage = () => {

    const [trainingLabels, setTrainingLabels] = useState([]);
    const [trainingResults, setTrainingResults] = useState("");
    const [nameOnShowSubPage, setNameOnShowSubPage] = useState("Show Training");
    const [isOnClassifierTraining, setIsOnClassifierTraining] = useState(false);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);
    const [boxCheckedTaskLabels, setBoxCheckedTaskLabels] = useState([]);
    const [radioCheckedTaskLabel, setRadioCheckedTaskLabel] = useState("");
    const [isOnShowDataSamples, setIsOnShowDataSamples] = useState(false);
    const [isClickedShowDataSamples, setIsClickedShowDataSamples] = useState(false);
    const [isOnLoadingShowDataSamples, setIsOnLoadingShowDataSamples] = useState(false);
    const [sampleItems, setSampleItems] = useState([]);

    const handleSwitchOnShowSubPage = (event) => {
        setNameOnShowSubPage(event.target.value);
    }

    const handleClickedShowDataSamples = (event) => {
        setIsClickedShowDataSamples(true);
    }

    const setThisBoxChecked = (e, index) => {
        let updatedListItems = [...boxCheckedTaskLabels];
        if (e.target.checked) {
            updatedListItems[index] = trainingLabels[index];
        } else {
            updatedListItems[index] = "";
        }
        console.log(updatedListItems);
        console.log(trainingLabels);
        setBoxCheckedTaskLabels([...updatedListItems]);
    }

    const setThisRadioChecked = (e, index) => {
        let updatedListItems = [...trainingLabels];
        setRadioCheckedTaskLabel(updatedListItems[index]);
    }

    useEffect(() => {
        try {
            const response = fetch("/config/load/classifier", {
                method: 'GET',
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
                .then(response => {
                    if (response === undefined) {
                        throw new Error("classifier config loading response is null.");
                    } else if (!response.ok) {
                        throw new Error('classifier config loading response was not ok.');
                    }
                    return response.json();
                })
                .then((data) => {
                    const classifier_config_keys = [];
                    const classifier_config_map = data['classifier_config'];
                    for (const [key, value] of Object.entries(classifier_config_map)) {
                        classifier_config_keys.push(key);
                    }
                    setTrainingLabels(x => { return classifier_config_keys });
                    setBoxCheckedTaskLabels(x => { return classifier_config_keys });
                    setRadioCheckedTaskLabel(x => { return classifier_config_keys[0]});
                })
                .catch((postErr) => {
                    // Handle error response
                    if (postErr === "") {
                        postErr = "Classifier Process Error.";
                    }
                    setLoadConfigClassifierError(postErr);
                });
        } catch (error) {
            setLoadConfigClassifierError(error);
        } finally {
        }
    }, []);

    const handleTrainingRequest = () => {
        try {
            setIsOnClassifierTraining(true);
            const response = fetch("/config/train/classifier", {
                method: 'POST',
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify({ "trainingLabels": boxCheckedTaskLabels }),
            })
                .then(response => {
                    if (response === undefined) {
                        throw new Error("classifier config training response is null.");
                    } else if (!response.ok) {
                        throw new Error('classifier config training response was not ok.');
                    }
                    return response.json();
                })
                .then(data => {
                    const data_json = JSON.stringify(data, null, 2);
                    setTrainingResults(data_json);
                })
                .catch((postErr) => {
                    // Handle error response
                    if (postErr === "") {
                        postErr = "Classifier training error";
                    }
                    setLoadConfigClassifierError(postErr);
                });
        } catch (error) {
            setLoadConfigClassifierError(error);
        } finally {
            setTimeout(() => setIsOnClassifierTraining(false), 200);
        }
    }

    return (
        <Container fluid>
            <Row className="mb-3">
                <Col xs={12}>
                    <h2>Classifier Setup</h2>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={4}>
                    <Form>
                        <Form.Group className='approval-switch-header'>
                            <Form.Check
                                type="radio"
                                label={<h6>Show Training</h6>}
                                value="Show Training"
                                checked={nameOnShowSubPage === 'Show Training'}
                                onChange={handleSwitchOnShowSubPage}
                            />
                            <Form.Check
                                type="radio"
                                label={<h6>Show Data Samples</h6>}
                                value="Show Data Samples"
                                checked={nameOnShowSubPage === 'Show Data Samples'}
                                onChange={handleSwitchOnShowSubPage}
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col className='justify-content-center' xs={3}>
                    <Row>
                        <p>Classifier training labels:</p>
                    </Row>
                    <Form>
                        <Form.Group >
                            {trainingLabels.map((key, index) => (
                                <div key={`${index}-wrapper`} className="flex-container">
                                    {
                                        nameOnShowSubPage === "Show Training" ? (
                                            <div key={`${index}-checkbox`}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={key === boxCheckedTaskLabels[index]}
                                                    onChange={(e) => setThisBoxChecked(e, index)}
                                                    className="mb-3"
                                                >
                                                </Form.Check>
                                            </div>
                                        ) : (
                                            <div key={`${index}-radio`}>
                                                <Form.Check
                                                    type="radio"
                                                    checked={key === radioCheckedTaskLabel}
                                                    onChange={(e) => setThisRadioChecked(e, index)}
                                                    className="mb-3"
                                                >
                                                </Form.Check>
                                            </div>
                                        )
                                    }

                                    <div key={`${index}-task-label`}><p>&#160;&#160;&#160;&#160;{key}</p></div>
                                </div>
                            ))}
                        </Form.Group>
                    </Form>
                    <Col >
                        <div className='flex-container-end'>
                            <div>
                                {nameOnShowSubPage === 'Show Training' ? (
                                    <Button variant="primary" className="mb-2" onClick={handleTrainingRequest}>
                                        {isOnClassifierTraining ? (
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        ) : "Train"}
                                    </Button>
                                ) : (
                                    <Button variant="primary" className="mb-2" onClick={handleClickedShowDataSamples}>
                                        {isOnLoadingShowDataSamples ? (
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        ) : "Show"}
                                    </Button>
                                )}
                                
                            </div>
                        </div>
                    </Col>
                </Col>
                <Col xs={8}>
                    {nameOnShowSubPage === 'Show Training' && (isOnClassifierTraining ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (trainingResults !== ""
                    ? (<pre>{trainingResults}</pre>)
                    : (<p>Training results will show here.</p>)
                    ))}
                    {nameOnShowSubPage === 'Show Data Samples' && (isOnLoadingShowDataSamples ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : ((sampleItems.length > 0 || isClickedShowDataSamples) ? (
                        <ConfigClassifierDataSampleComponent 
                                                    isClickedShowDataSamples={isClickedShowDataSamples} 
                                                    setIsClickedShowDataSamples={setIsClickedShowDataSamples}
                                                    isOnLoadingShowDataSamples={isOnLoadingShowDataSamples}
                                                    setIsOnLoadingShowDataSamples={setIsOnLoadingShowDataSamples}
                                                    sampleItems={sampleItems}
                                                    setSampleItems={setSampleItems}
                                                    radioCheckedTaskLabel={radioCheckedTaskLabel}
                                                    >
                        </ConfigClassifierDataSampleComponent>
                    ) : (
                        <p>Sample contents will show here.</p>)
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default ConfigClassifierPage;
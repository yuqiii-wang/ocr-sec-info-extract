import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import ConfigNERRegexComponent from './ConfigNERRegexComponent';
import { ArrowClockwise } from 'react-bootstrap-icons';

const ConfigNERPage = () => {

    const [nerTaskLabels, setNerTaskLabels] = useState([]);
    const [nerTaskItemLabels, setNerTaskItemLabels] = useState([]);
    const [isOnLoadingNerDetails, setIsOnLoadingNerDetails] = useState(false);
    const [isSubListExpanded, setIsSubListExpanded] = useState(false);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState('A');
    const [selectedNerTaskLabel, setSelectedNerTaskLabel] = useState('');
    const [selectedNerItemLabel, setSelectedNerItemLabel] = useState('');
    const [selectedNerItemDetails, setSelectedNerItemDetails] = useState({});

    const handleSwitchNerMethod = (event) => {
        setSelectedComponent(event.target.value);
    };

    const toggleSubListExpand = () => {
        setIsSubListExpanded(!isSubListExpanded);
        return !isSubListExpanded;
    };


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
            .then( response => {
                if (response == undefined) {
                    throw new Error("classifier config loading response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config loading response was not ok.');
                }
                return response.json();
            })
            .then( (data) => {
                const classifier_config_keys = [];
                const classifier_config_map = data['classifier_config'];
                for (const [key, value] of Object.entries(classifier_config_map)) {
                    classifier_config_keys.push(key);
                }
                setNerTaskLabels(classifier_config_keys);
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr == "") {
                    postErr = "Classifier Process Error.";
                }
                setLoadConfigClassifierError(postErr);
            });
        } catch (error) {
            setLoadConfigClassifierError(error);
        } finally {
            ;
        }
      }, []);

    const handleGetNerTaskItemsRequest = (nertask) => {
        try {
            setSelectedNerTaskLabel(nertask);
            const response = fetch("/config/load/ner?" + "nertask=" + nertask, {
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
                setNerTaskItemLabels(data["ner_task_items"]);
                setSelectedNerItemLabel("");
                setSelectedNerItemDetails("");
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

    const handleAddNew = (neritem) => {
        if (neritem === "AddNew") {
            setSelectedNerItemLabel(neritem);
            setSelectedNerItemDetails({
                "full_regex": "",
                "key_regex": "",
                "val_regex": ""
              })
            return;
        }
    }

    const handleGetNerTaskItemDetailsRequest = (nertask, neritem) => {
        try {
            setSelectedNerTaskLabel(nertask);
            setSelectedNerItemLabel(neritem);
            const response = fetch("/config/load/ner?" + "nertask=" + nertask + "&neritem=" + neritem, {
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
                setSelectedNerItemDetails(data["ner_task_item_details"]);
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

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col xs={12}>
          <h2>Named Entity Recognition (NER) Config & Training</h2>
        </Col>
      </Row>
      <Row>
        <Col className='justify-content-center' xs={4}>
        <Row>
        <div className='flex-container'>
            <p>NER tasks:</p>
            <ArrowClockwise className='ner-refresh-btn' onClick={() => {
                handleGetNerTaskItemsRequest(selectedNerTaskLabel)}}></ArrowClockwise>
            <p></p>
        </div>
          </Row>
          <ul>
        {nerTaskLabels.map((nerTask) => (
            <React.Fragment key={nerTask}>
          <li key={nerTask} className={`link-style ${isSubListExpanded ? 'expanded' : ''}`} onClick={() => {
                                                                                            toggleSubListExpand();
                                                                                            handleGetNerTaskItemsRequest(nerTask)}
                                                                                        }
            >
            {nerTask}
            </li>
          {nerTaskItemLabels.map((nerTaskItem) => (selectedNerTaskLabel == nerTask && (
                <ul key={nerTaskItem} className={`link-style link-style-sublist ${isSubListExpanded ? 'expanded' : ''}`}
                    onClick={() => handleGetNerTaskItemDetailsRequest(nerTask, nerTaskItem)}>{nerTaskItem}
                </ul>
          )))}
          {selectedNerTaskLabel == nerTask && isSubListExpanded &&(
            <ul className="add-new">
                <li className={`link-style link-style-sublist ${isSubListExpanded ? 'expanded' : ''}`} 
                    onClick={() => handleAddNew("AddNew")}>
                        Add New
                </li>
            </ul>
          )}
          </React.Fragment>
        ))}
      </ul>
        </Col>
        <Col xs={8}>
        <Form>
            <Form.Group className='approval-switch-header'>
                <Form.Check
                    type="radio"
                    label={<h5>By text pattern (Regex)</h5>}
                    value="A"
                    checked={selectedComponent === 'A'}
                    onChange={handleSwitchNerMethod}
                />
                <Form.Check
                    type="radio"
                    label={<h5>By semantic learning (Embedding)</h5>}
                    value="B"
                    checked={selectedComponent === 'B'}
                    onChange={handleSwitchNerMethod}
                />
            </Form.Group>
        </Form>
        { nerTaskItemLabels.length === 0 || !isSubListExpanded ? (
            <p>Click an NER item to start, or <span className='link-style'>
                <span style={{fontWeight:"bold"}}>+</span> Add New</span>.
            </p>
        ) : selectedComponent === 'A' ? (
            <ConfigNERRegexComponent
                nerTaskLabels={nerTaskLabels}
                selectedNerTaskLabel={selectedNerTaskLabel}
                selectedNerItemLabel={selectedNerItemLabel}
                selectedNerItemDetails={selectedNerItemDetails}>
            </ConfigNERRegexComponent>
            ) : (
                <div>To be continued...</div>
            )
        }
                
        </Col>
      </Row>
    </Container>
  );
}

export default ConfigNERPage;
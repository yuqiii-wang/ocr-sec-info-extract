import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import { Check } from 'react-bootstrap-icons';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ErrorBar from '../others/ErrorBar';
import { QuestionCircle } from 'react-bootstrap-icons';
import ConfigHandlerComponent from './ConfigHandlerComponent';
import "./css/Config.css";

const ConfigHandlerPage = () => {

    const [nerTaskLabels, setNerTaskLabels] = useState([]);
    const [nerTaskItemLabels, setNerTaskItemLabels] = useState([]);
    const [isSubListExpanded, setIsSubListExpanded] = useState(false);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);
    const [selectedNerTaskLabel, setSelectedNerTaskLabel] = useState('');
    const [nerIsInUseSet, setNerIsInUseSet] = useState(new Set([]));


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
                if (response === undefined) {
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
                if (postErr === "") {
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
                if (response === undefined) {
                    throw new Error("classifier config training response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config training response was not ok.');
                }
                return response.json();
            })
            .then( data => {
                setNerTaskItemLabels(data["ner_task_items"]);
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
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
          <h2>Script Generation Template Setup</h2>
        </Col>
      </Row>
      <Row>
        <Col className='justify-content-center' xs={3}>
        <Row>
        <div className='flex-container'>
            <p>NER tasks:<OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip id="tooltip-info">
                            <div className='tooltip-content'>
                                <p>Check NER items in double curly braces &#123;&#123; NER_Item_Name &#125;&#125; 
                                    from <i>NER Populated Scripts</i>, if used, show ticked.</p>
                            </div>
                            </Tooltip>}
                    >
                        <Button variant="link">
                        <QuestionCircle size={24} />
                        </Button>
                    </OverlayTrigger>
            </p>
        </div>
          </Row>
          <ul>
        {nerTaskLabels.map((nerTask) => (
            <div key={nerTask}>
          <li key={nerTask} className={`link-style ${isSubListExpanded ? 'expanded' : ''}`} onClick={() => {
                                                                                            toggleSubListExpand();
                                                                                            handleGetNerTaskItemsRequest(nerTask)}
                                                                                        }
            >
            {nerTask}
            </li>
          {nerTaskItemLabels.map((nerTaskItem) => (selectedNerTaskLabel === nerTask && (
                <ul key={nerTaskItem} className={`link-style-ticked-sublist ${isSubListExpanded ? 'expanded' : ''}`} >
                    <Check size={18} color="blue" key={nerTaskItem} hidden={!nerIsInUseSet.has(nerTaskItem)}></Check>
                {nerTaskItem}
                </ul>
          )))}
          </div>
        ))}
      </ul>
        </Col>
        <Col xs={9}>
        {selectedNerTaskLabel !== "" ? ( 
            <ConfigHandlerComponent 
            nerTaskItemLabels={nerTaskItemLabels}
            selectedNerTaskLabel={selectedNerTaskLabel}
            nerIsInUseSet={nerIsInUseSet}
            setNerIsInUseSet={setNerIsInUseSet}></ConfigHandlerComponent>
        ) : (
            "Click a task to begin..."
        )}
        </Col>
      </Row>
    </Container>
  );
}

export default ConfigHandlerPage;
import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import "./css/Config.css";

const ConfigClassifierPage = () => {

    const [trainingLabels, setTrainingLabels] = useState([]);
    const [trainingResults, setTrainingResults] = useState("");
    const [isOnClassifierTraining, setIsOnClassifierTraining] = useState(false);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);

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
                setTrainingLabels(classifier_config_keys);
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
                body: JSON.stringify({}),
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
                const data_json = JSON.stringify(data, null, 2);
                setTrainingResults(data_json);
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
            setTimeout(() => setIsOnClassifierTraining(false), 200);
        }
    }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col xs={12}>
          <h1>Classifier Training</h1>
        </Col>
      </Row>
      <Row>
        <Col className='justify-content-center' xs={4}>
        <Row>
        <Col className='justify-content-center' xs={4}>
          <Button variant="primary" className="mb-2" onClick={handleTrainingRequest}>
            {isOnClassifierTraining ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : "Train"}
          </Button>
          </Col>
        <p>Classifier training labels</p>
          </Row>
          <ul>
        {trainingLabels.map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
        </Col>
        <Col xs={8}>
          {isOnClassifierTraining ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : trainingResults != "" 
                    ? (<pre>{trainingResults}</pre>)
                    : (<p>Training results will show here.</p>)}
        </Col>
      </Row>
    </Container>
  );
};

export default ConfigClassifierPage;
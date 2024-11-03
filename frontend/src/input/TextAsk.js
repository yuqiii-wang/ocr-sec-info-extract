import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import {GlobalAppContext} from "../GlobalAppContext";
import './css/Input.css';

const TextAsk = () => {
    const { setIsOnHomeAskPage, setIsJustStart,
        setReferenceTextNerJsonResults,
        setReferenceTextNerPosResults,
        setReferenceSrcTextResults,
        setTaskLabel, setIsMainAskDone, setApprovalTemplateId,
        setAnswerLoading, setIsSolutionShowDone
    } = useContext(GlobalAppContext);

    const [inputValue, setInputValue] = useState('');
    const [dots, setDots] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setAnswerLoading(true);
            const response = await fetch("/process/ask", {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                mode: "cors",
                body: JSON.stringify({ "msg": inputValue }),
            })
            .then( response => {
                if (response == undefined) {
                    throw new Error("file upload response is null.");
                } else if (!response.ok) {
                    throw new Error('file upload response was not ok.');
                }
                return response.json();
            })
            .then( data => {
                setReferenceTextNerJsonResults(data["ner_results"]);
                setReferenceTextNerPosResults(data["ner_pos"]);
                setReferenceSrcTextResults(data["msg"]);
                setTaskLabel(data["task_label"]);
                setIsSolutionShowDone(true);
                const approvalThisTemplateId = data["approval_template_id"] !== undefined ? data["approval_template_id"] : -1;
                setApprovalTemplateId(approvalThisTemplateId);
                setInputValue('');
            });
        } catch (error) {
            console.error('Error sending message');
        } finally {
            setIsOnHomeAskPage(false);
            setIsJustStart(false);
            setIsMainAskDone(true);
            setAnswerLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length === 3 ? '' : prevDots + '.'));
        }, 500); // Adjust the interval time if necessary
        return () => clearInterval(interval);
    }, []);

    const textInputPlaceholder = "Input user query, e.g., unsettle a trade 1234567890" + dots;

    return (
        <Container className="input-text-wrapper" >
        <Row style={{
            "display": 'flex',
            "justifyContent": 'end',
            "flexDirection": 'row',
            "alignItems": 'center',
            "height": "100%"
        }} >
            <Col className="col-11">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="autoGrowingTextArea" className='input-text'>
                    <Form.Control
                        placeholder={textInputPlaceholder}
                        as="textarea"
                        value={inputValue}
                        onChange={handleChange}
                        style={{
                            minHeight: '40px',
                            overflow: 'hidden',
                            resize: 'none',
                        }}
                        rows={1}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                    />
                </Form.Group>
            </Form>
            </Col>
            <Col className="col-1">
                <Button type="submit" variant="primary" className='input-text-ask-btn'
                    onClick={handleSubmit}>
                        Ask
                </Button>
            </Col>
            </Row>
        </Container>
    );
};

export default TextAsk;

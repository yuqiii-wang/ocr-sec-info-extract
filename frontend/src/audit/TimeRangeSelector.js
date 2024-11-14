import React, { useState } from 'react';
import { Dropdown, Form, Col, Button, Row } from 'react-bootstrap';

const TimeRangeSelector = () => {
    const [timeRange, setTimeRange] = useState('Last 1 day');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    const handleSelect = (eventKey) => {
        setTimeRange(eventKey);
        if (eventKey === 'Custom') {
            setIsCustom(true);
        } else {
            setIsCustom(false);
        }
    };

    const handleTimeSearchRequest = () => {}

    return (
        <div>
            <Row>
            <Col>
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {timeRange}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Last 12 hours">Last 12 hours</Dropdown.Item>
                    <Dropdown.Item eventKey="Last 1 day">Last 1 day</Dropdown.Item>
                    <Dropdown.Item eventKey="Last 3 days">Last 3 days</Dropdown.Item>
                    <Dropdown.Item eventKey="Last 7 days">Last 7 days</Dropdown.Item>
                    <Dropdown.Item eventKey="Last 1 month">Last 1 month</Dropdown.Item>
                    <Dropdown.Item eventKey="Custom">Custom</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </Col>
            <Col md="2">
            <Button
                variant="primary"
                type="submit"
                disabled={(isCustom && customStart!='' && customEnd!='') || !isCustom ? false : true}
                onClick={handleTimeSearchRequest}
            >
                Search
            </Button>
            </Col>
            </Row>

            {isCustom && (
                <Col >
                    <Form.Group>
                        <Form.Label>Start DateTime</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>End DateTime</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            )}
        </div>
    );
};

export default TimeRangeSelector;

import React, { useEffect, useState } from 'react';
import { Dropdown, Form, Col, Button, Row } from 'react-bootstrap';

const TimeRangeSelector = ({setAuditData, timeRange, setTimeRange}) => {
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

    useEffect(() => {
        if (!isCustom || (customStart !== '' && customEnd !== '')) {
            handleTimeSearchRequest();
        }
    }, [timeRange]);

    const formatDatetime = (datetime) => {
        // Format as YYYY-MM-DD HH:MM:SS
        const year = datetime.getFullYear();
        const month = String(datetime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(datetime.getDate()).padStart(2, "0");
        const hours = String(datetime.getHours()).padStart(2, "0");
        const minutes = String(datetime.getMinutes()).padStart(2, "0");
        const seconds = String(datetime.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const computeStartEndSearchTime = () => {
        let endTime = new Date(); // now
        let startTime = new Date(); // now
        if (!isCustom) {if (timeRange === "Last 1 day") {
                startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
            } else if (timeRange === "Last 7 days") {
                startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (timeRange === "Last 1 month") {
                startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
            } else if (timeRange === "Last 3 months") {
                startTime = new Date(endTime.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
            } 
        } else {
            startTime = new Date(customStart);
            endTime = new Date(customEnd);
        }
        const startTimeStr = formatDatetime(startTime);
        const endTimeStr = formatDatetime(endTime);
        return [startTimeStr, endTimeStr];
    }

    const handleTimeSearchRequest = () => {
        const startEndTimeStrs = computeStartEndSearchTime();
        const queryString = new URLSearchParams({
            "start_time": startEndTimeStrs[0],
            "end_time": startEndTimeStrs[1]
        }).toString();
        try {
            const response = fetch("/audit/load/time?" + queryString, {
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
                setAuditData(data);
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

    return (
        <div>
            <Row>
            <Col>
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {timeRange}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Last 1 day">Last 1 day</Dropdown.Item>
                    <Dropdown.Item eventKey="Last 7 days">Last 7 days</Dropdown.Item>
                    <Dropdown.Item eventKey="Last 1 month">Last 1 month</Dropdown.Item>
                    <Dropdown.Item eventKey="Last 3 months">Last 3 months</Dropdown.Item>
                    <Dropdown.Item eventKey="Custom">Custom</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </Col>
            <Col md="2">
            {isCustom && <Button
                variant="primary"
                type="submit"
                disabled={isCustom && customStart!='' && customEnd!=''}
                onClick={handleTimeSearchRequest}
            >
                Search
            </Button>}
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

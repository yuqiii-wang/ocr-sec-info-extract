import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card, Tab, Tabs } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { GlobalAppContext } from "../GlobalAppContext";
import { CodeContext } from "./CodeContext";

import './css/CodeDetail.css'
import CodeCard from "./CodeCard";
import SummaryCard from "./CodeSummaryCard";
import CodeErrorCard from "./CodeErrorCard";

const CodeDetailComponent = ({ code }) => {
    const { isSolutionConcludeDone, referenceCodeSepOffset } = useContext(GlobalAppContext);
    const { setIsEditingCode, isEditingCode } = useContext(CodeContext);

    const [key, setKey] = useState('code');

    const handleEditToggle = () => {
        setIsEditingCode(!isEditingCode);
    };

    return (
        <div>
            <div className="code-card-content-container"
                style={{ width: '100%', height: `${Math.min(31, 6 + referenceCodeSepOffset)}rem` }}>
                <Tabs
                    id="code-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                >
                    <Tab eventKey="code" title="Code">
                        <CodeCard code={code} />
                    </Tab>
                    <Tab eventKey="error" title="Error">
                        <CodeErrorCard />
                    </Tab>
                    <Tab eventKey="summary" title="Summary">
                        <SummaryCard />
                    </Tab>
                </Tabs>
            </div>
            <Card.Footer style={{ display: "flex", justifyContent: "flex-end" }}>
                <React.Fragment>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isSolutionConcludeDone ? true : false}
                        className={!isSolutionConcludeDone ? "code-btn-container" : ""}
                        style={{ display: "flex", marginLeft: "1%", marginRight: "1%" }}
                        onClick={handleEditToggle}>
                        Edit
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isSolutionConcludeDone ? true : false}
                        className={!isSolutionConcludeDone ? "code-btn-container" : ""}
                        style={{ display: "flex", marginLeft: "1%", marginRight: "1%" }}
                    >
                        Execute
                    </Button>
                </React.Fragment>

            </Card.Footer>
        </div>
    );
};

export default CodeDetailComponent;

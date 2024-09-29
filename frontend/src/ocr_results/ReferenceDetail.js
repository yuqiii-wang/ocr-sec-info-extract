import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import ImageReferenceDetails from "./ImageReferenceDetails";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";

const ReferenceDetailComponent = () => {
    const { referenceResults, referenceImageResults, solutionId, isSolutionShowDone,
        setExecutionLoading, referenceCodeSepOffset } = useContext(GlobalAppContext);

    const [hover, setHover] = useState(false);

    const handleConvert = () => {
        console.log(referenceImageResults);
    };

    return (
        <Container className="reference-detail-list-container"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            {referenceImageResults != null ? (
                <ImageReferenceDetails />
            ) : ("")}
            <OverlayTrigger placement="top" overlay={
                    <Tooltip id="button-tooltip">
                        Convert OCR results into shell scripts.
                    </Tooltip>
                } >
                    <Button variant="primary" type="submit" className="reference-convert-btn"
                    style={{ top: `${Math.max(8, 26.5 - referenceCodeSepOffset)}rem` }}
                        onClick={handleConvert} disabled={!isSolutionShowDone}>
                        Convert
                    </Button>
                </OverlayTrigger>
        </Container>
    );
};

export default ReferenceDetailComponent;

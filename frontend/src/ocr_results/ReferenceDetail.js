import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import ImageReferenceDetails from "./ImageReferenceDetails";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";

const ReferenceDetailComponent = () => {
    const { referenceResults, referenceImageResults, 
        solutionId, isSolutionShowDone, referenceOCRJsonResults,
        referenceShellScriptResults, setReferenceShellScriptResults,
        setExecutionLoading, referenceCodeSepOffset, setIsOnInputShow,
        setIsSolutionConcludeDone } = useContext(GlobalAppContext);

    const [hover, setHover] = useState(false);
    const [conversionError, setConversionError] = useState("");

    const handleConvert = () => {
        setIsSolutionConcludeDone(true);
        try {
            const response = fetch("/process/convert", {
                method: 'POST',
                body: JSON.stringify({"ocr_json": referenceOCRJsonResults}),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response == undefined) {
                    throw new Error("ocr json conversion response is null.");
                } else if (!response.ok) {
                    throw new Error('ocr json conversion response was not ok.');
                }
                return response.json();
            })
            .then( async (data) => {
                if (data.error != undefined) {
                    setConversionError(data.error);
                } else {
                    setReferenceShellScriptResults(data["shell_scripts"]);
                    setIsOnInputShow(false);
                }
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr == "") {
                    postErr = "Image Process Error.";
                }
                setConversionError(postErr);
            });
        } catch (error) {
            setConversionError(error);
        } finally {
            ;
        }
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

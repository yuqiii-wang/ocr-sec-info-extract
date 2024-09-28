import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import ImageReferenceDetails from "./ImageReferenceDetails";
import { GlobalAppContext } from "../GlobalAppContext";

const ReferenceDetailComponent = () => {
    const { referenceResults, referenceImageResults, solutionId, isSolutionShowDone,
        setExecutionLoading, referenceCodeSepOffset } = useContext(GlobalAppContext);

    const [hover, setHover] = useState(false);

    return (
        <div>
            <Container className="reference-detail-list-container"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}>
                {referenceImageResults != null ? (
                    <ImageReferenceDetails className="mt-auto" />
                ) : ("")}
            </Container>
        </div>
    );
};

export default ReferenceDetailComponent;

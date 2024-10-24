import React, { useState, useContext, useEffect, useRef, useCallback, } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, } from "react-bootstrap";
import ReferenceDetailComponent from "./ReferenceDetail";
import LogReferenceDetail from './LogReferenceDetail';
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";


const ReferenceComponent = () => {
    const { answerLoading, detailResults, isSolutionShowDone,
        referenceImageResults, referenceCodeSepOffset,
        isOnLoadingExecutionLog,
        isDoneLoadingExecutionLog, } = useContext(GlobalAppContext);

    return (
        <Container className="image-reference-container border rounded"
        style={{ height: `${Math.max(8, 28 - referenceCodeSepOffset)}rem` }}>
            {answerLoading ? (
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            ) : (isOnLoadingExecutionLog || isDoneLoadingExecutionLog) ? (
                <LogReferenceDetail />
            ) : (
                <ReferenceDetailComponent />
            )}
        </Container>
    );
};

export default ReferenceComponent;

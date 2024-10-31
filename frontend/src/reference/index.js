import React, { useContext, } from "react";
import { Container, Spinner, } from "react-bootstrap";
import TextAsk from "../input/TextAsk";
import ReferenceDetailComponent from "./ReferenceDetail";
import LogReferenceDetail from './LogReferenceDetail';
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";


const ReferenceComponent = () => {
    const { answerLoading, detailResults, isOnHomeAskPage,
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
            ) : isOnHomeAskPage ? (
                <TextAsk />
            ) : (isOnLoadingExecutionLog || isDoneLoadingExecutionLog) ? (
                <LogReferenceDetail />
            ) : (
                <ReferenceDetailComponent />
            )}
        </Container>
    );
};

export default ReferenceComponent;

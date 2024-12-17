import React, { useContext, } from "react";
import { Container, } from "react-bootstrap";
import ProgressBarComponent from "../others/LoadingProgressBar";
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
                <ProgressBarComponent subscribedTopic="ocr_progress"></ProgressBarComponent>
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

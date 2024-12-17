import React, { useState, useEffect, useContext, } from "react";
import { Container, Button } from "react-bootstrap";
import ImageReferenceDetails from "./ImageReferenceDetails";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ApprovalModal from "../others/ApprovalModal";
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";
import TextReferenceDetail from "./TextReferenceDetail";
import SwitchHandlerComponent from "./SwitchHandlerComponent";
import MergedNerJsonReferenceDetail from "./MergedNerJsonReferenceDetail";

const ReferenceDetailComponent = () => {
    const { referenceImageResults, taskLabel, approvalTemplateId, isMainAskDone,
        isSolutionShowDone, referenceOCRJsonResults, referenceMergedNerJsonResults,
        setReferenceShellScriptResults, referenceSrcTextResults, referenceTextNerJsonResults,
        referenceCodeSepOffset, setIsOnInputShow, setReferenceMergedNerJsonResults,
        setIsSolutionConcludeDone } = useContext(GlobalAppContext);

    const [trainingLabels, setTrainingLabels] = useState([]);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);
    const [hover, setHover] = useState(false);
    const [conversionError, setConversionError] = useState("");
    const [isShowApprovalModal, setIsShowApprovalModal] = useState(false);
    const [isShowMergedNerJsonResults, setIsShowMergedNerJsonResults] = useState(false);

    useEffect(() => {
        try {
            const response = fetch("/config/load/classifier", {
                method: 'GET',
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response === undefined) {
                    throw new Error("classifier config loading response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config loading response was not ok.');
                }
                return response.json();
            })
            .then( (data) => {
                const classifier_config_keys = [];
                const classifier_config_map = data['classifier_config'];
                for (const [key, value] of Object.entries(classifier_config_map)) {
                    classifier_config_keys.push(key);
                }
                setTrainingLabels(classifier_config_keys);
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
                    postErr = "Classifier Process Error.";
                }
                setLoadConfigClassifierError(postErr);
            });
        } catch (error) {
            setLoadConfigClassifierError(error);
        } finally {
            ;
        }
      }, []);

    const handleConvert = () => {
        setIsSolutionConcludeDone(true);
        try {
            const response = fetch("/process/convert", {
                method: 'POST',
                body: JSON.stringify({ "ocr_jsons": referenceOCRJsonResults,
                                        "ner_jsons": referenceTextNerJsonResults,
                                        "task_label": taskLabel
                 }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then(response => {
                if (response === undefined) {
                    throw new Error("ocr json conversion response is null.");
                } else if (!response.ok) {
                    throw new Error('ocr json conversion response was not ok.');
                }
                return response.json();
            })
            .then( (data) => {
                if (data.error !== undefined) {
                    setConversionError(data.error);
                } else {
                    setReferenceMergedNerJsonResults(data["merged_ner_jsons"]);
                    setIsOnInputShow(false);
                    generateShellScripts(data["merged_ner_jsons"]);
                }
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
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

    const handleGenerateShellScripts = () => {
        generateShellScripts(referenceMergedNerJsonResults);
    }

    const generateShellScripts = (mergedNerJsons) => {
        if (mergedNerJsons === undefined) {
            return;
        }
        console.log(mergedNerJsons);
        try {
            const response = fetch("/process/generate", {
                method: 'POST',
                body: JSON.stringify({ "ner_jsons": mergedNerJsons,
                                        "task_label": taskLabel
                 }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then(response => {
                if (response === undefined) {
                    throw new Error("ocr json conversion response is null.");
                } else if (!response.ok) {
                    throw new Error('ocr json conversion response was not ok.');
                }
                return response.json();
            })
            .then(async (data) => {
                if (data.error !== undefined) {
                    setConversionError(data.error);
                } else {
                    setReferenceShellScriptResults(data["shell_scripts"]);
                    setIsShowMergedNerJsonResults(true);
                    setIsOnInputShow(false);
                }
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
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
        <Container className="reference-detail-list-container">
            {taskLabel && (<React.Fragment>
                <div className="flex-container">
                    <div> <p style={{fontWeight: "bold"}}>Assigned task handler: &#160;&#160;&#160;&#160;</p>
                    </div>
                    <div> <SwitchHandlerComponent taskHandlerLabels={trainingLabels} loadedTaskHandlerLabel={taskLabel}/>
                    </div>
                </div>
                {isShowMergedNerJsonResults && (<React.Fragment>
                <p><span style={{fontWeight: "bold"}}>Merged NERs</span>:</p>
                    <MergedNerJsonReferenceDetail 
                        referenceMergedNerJsonResults={referenceMergedNerJsonResults}
                        setReferenceMergedNerJsonResults={setReferenceMergedNerJsonResults}>
                    </MergedNerJsonReferenceDetail>
                    </React.Fragment>)}
                <p><span style={{fontWeight: "bold"}}>Content</span>: </p>
                </React.Fragment>)}
            {referenceImageResults.length > 0 ? (
                <ImageReferenceDetails />
            ) : referenceSrcTextResults !== "" ? (
                <TextReferenceDetail></TextReferenceDetail>
            ) : ("")}
            {approvalTemplateId !== -1 &&(
                <OverlayTrigger placement="top" overlay={
                    <Tooltip id="button-tooltip">
                        This query need management approval
                    </Tooltip>
                }>
                    <Button variant="primary" type="submit" className="reference-approval-btn"
                    style={{ top: `${Math.max(8, 23.5 - referenceCodeSepOffset)}rem` }}
                    onClick={() => setIsShowApprovalModal(true)} disabled={!isSolutionShowDone}>
                    Review Approval
                </Button>
                </OverlayTrigger>
            )}

            {
                isShowMergedNerJsonResults ? (
                <OverlayTrigger placement="top" overlay={
                    <Tooltip id="button-tooltip">
                        Generate shell scripts given the shown merged NER results.
                    </Tooltip>
                } >
                    <Button variant="primary" type="submit" className="reference-convert-btn"
                        style={{ top: `${Math.max(8, 26.5 - referenceCodeSepOffset)}rem` }}
                        onClick={handleGenerateShellScripts} disabled={!isSolutionShowDone || approvalTemplateId!==-1}>
                        Generate
                    </Button>
                </OverlayTrigger>) : (
                <OverlayTrigger placement="top" overlay={
                    <Tooltip id="button-tooltip">
                        Convert OCR/parsed text results into shell scripts.
                    </Tooltip>
                } >
                    <Button variant="primary" type="submit" className="reference-convert-btn"
                        style={{ top: `${Math.max(8, 26.5 - referenceCodeSepOffset)}rem` }}
                        onClick={handleConvert} disabled={!isSolutionShowDone || approvalTemplateId!==-1}>
                        Convert
                    </Button>
                </OverlayTrigger>
                )
            }
            
            <ApprovalModal show={isShowApprovalModal}
                        handleClose={() => setIsShowApprovalModal(false)}
            />
        </Container>
    );
};

export default ReferenceDetailComponent;

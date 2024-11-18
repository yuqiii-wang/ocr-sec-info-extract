import React, { useState, useEffect, useContext, } from "react";
import { Container, Button, DropdownButton, Dropdown } from "react-bootstrap";
import ImageReferenceDetails from "./ImageReferenceDetails";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ApprovalModal from "../others/ApprovalModal";
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";
import TextReferenceDetail from "./TextReferenceDetail";
import MergedNerJsonReferenceDetail from "./MergedNerJsonReferenceDetail";

const ReferenceDetailComponent = () => {
    const { referenceImageResults, taskLabel, approvalTemplateId,
        isSolutionShowDone, referenceOCRJsonResults, referenceMergedNerJsonResults,
        setReferenceShellScriptResults, referenceSrcTextResults,
        referenceCodeSepOffset, setIsOnInputShow, setReferenceMergedNerJsonResults,
        setIsSolutionConcludeDone } = useContext(GlobalAppContext);

    const [trainingLabels, setTrainingLabels] = useState([]);
    const [loadConfigClassifierError, setLoadConfigClassifierError] = useState([]);
    const [hover, setHover] = useState(false);
    const [isOnSwitchHandler, setIsOnSwitchHandler] = useState(false);
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
                if (response == undefined) {
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
                if (postErr == "") {
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

    const toggleIsOnSwitchHandler = () => {
        isOnSwitchHandler ? setIsOnSwitchHandler(false) : setIsOnSwitchHandler(true);
    }

    const handleConvert = () => {
        setIsSolutionConcludeDone(true);
        try {
            const response = fetch("/process/convert", {
                method: 'POST',
                body: JSON.stringify({ "ocr_jsons": referenceOCRJsonResults,
                                        "task_label": taskLabel
                 }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then(response => {
                if (response == undefined) {
                    throw new Error("ocr json conversion response is null.");
                } else if (!response.ok) {
                    throw new Error('ocr json conversion response was not ok.');
                }
                return response.json();
            })
            .then( (data) => {
                if (data.error != undefined) {
                    setConversionError(data.error);
                } else {
                    console.log(data["merged_ner_jsons"]);
                    setReferenceMergedNerJsonResults(data["merged_ner_jsons"]);
                    setIsOnInputShow(false);
                    console.log(data["merged_ner_jsons"]);
                    generateShellScripts(data["merged_ner_jsons"]);
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
                if (response == undefined) {
                    throw new Error("ocr json conversion response is null.");
                } else if (!response.ok) {
                    throw new Error('ocr json conversion response was not ok.');
                }
                return response.json();
            })
            .then(async (data) => {
                if (data.error != undefined) {
                    setConversionError(data.error);
                } else {
                    setReferenceShellScriptResults(data["shell_scripts"]);
                    setIsShowMergedNerJsonResults(true);
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
            {taskLabel && (<React.Fragment>
                <p><span style={{fontWeight: "bold"}}>Assigned task handler</span>: {taskLabel}</p>
                {isShowMergedNerJsonResults && (<React.Fragment>
                <p><span style={{fontWeight: "bold"}}>Merged NERs</span>:</p>
                    <MergedNerJsonReferenceDetail 
                        referenceMergedNerJsonResults={referenceMergedNerJsonResults}>
                    </MergedNerJsonReferenceDetail>
                    </React.Fragment>)}
                <p><span style={{fontWeight: "bold"}}>Content</span>: </p>
                </React.Fragment>)}
            {referenceImageResults.length > 0 ? (
                <ImageReferenceDetails />
            ) : referenceSrcTextResults != "" ? (
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
            <OverlayTrigger placement="top" overlay={
                <Tooltip id="button-tooltip">
                    Switch to another backend handler for query parsing
                </Tooltip>
            }>
                <div className="reference-add-btn"
                    style={{ top: `${Math.max(8, 26.5 - referenceCodeSepOffset)}rem` }}
                >
                    <DropdownButton id="dropdown-basic-button"
                        title="Switch Handler" onClick={toggleIsOnSwitchHandler}>
                            {trainingLabels.map((key) => (
                                <Dropdown.Item href="" key={key}>{key}</Dropdown.Item>
                            ))}
                    </DropdownButton>
                </div>
            </OverlayTrigger>

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
            <ApprovalModal show={isShowApprovalModal}
                        handleClose={() => setIsShowApprovalModal(false)}
            />
        </Container>
    );
};

export default ReferenceDetailComponent;

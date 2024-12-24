import React, { useState, useEffect, useContext, } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import { extractResponseImages } from "../others/ImageHandlingUtils"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";

const SwitchHandlerComponent = ({taskHandlerLabels, loadedTaskHandlerLabel}) => {
    const { setAnswerLoading,
        thisFileUuids, uploadedFilenames,
        setApprovalTemplateId, 
        setIsMainAskDone, thisSessionUuid,
        setTaskLabel, setReferenceImageResults, setIsSolutionShowDone,
        setReferenceOCRJsonResults,
        setInputError } = useContext(GlobalAppContext);


    const handleOnSelect = async (eventKey) => {
        if (eventKey !== loadedTaskHandlerLabel) {
            await processSubmitRequest(eventKey);
            await updatePrevImageAndTextSample(eventKey);
        }
    }

    const processSubmitRequest = async (newTaskHandlerLabel) => {
        setIsMainAskDone(false);
        setAnswerLoading(true);
        try {
            if (thisFileUuids === "") {
                setInputError("Not found a file to submit for OCR process.");
            }
            const response = fetch("/process/submit", {
                method: 'POST',
                body: JSON.stringify({ "filenames": uploadedFilenames,
                    "taskLabel": newTaskHandlerLabel
                 }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then(response => {
                if (response === undefined) {
                    throw new Error("file upload response is null.");
                } else if (!response.ok) {
                    throw new Error('file upload response was not ok.');
                }
                return response.json();
            })
            .then(async (data) => {
                try {
                    if (data.error !== undefined) {
                        setInputError(data.error);
                    } else if (data.zip_file !== null) {
                        const referenceResults = data;
                        const images = await extractResponseImages(referenceResults);
                        setReferenceImageResults(images);
                        setReferenceOCRJsonResults(data.solution_reference);
                        setIsSolutionShowDone(true);
                        setTaskLabel(data.task_label);
                        const approvalTemplateId = data.get("approval_template_id") !== undefined ? data.get("approval_template_id") : -1;
                        setApprovalTemplateId(approvalTemplateId);
                    }
                } catch (error) {
                    setInputError(error);
                } finally {
                    setIsMainAskDone(true);
                    setAnswerLoading(false);
                }
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
                    postErr = "Image Process Error.";
                }
                setInputError(postErr);
            });
        } catch (error) {
            setInputError(error);
        } finally {
            ;
        }
    };


    const updatePrevImageAndTextSample = async (newTaskHandlerLabel) => {
        console.log(newTaskHandlerLabel);
        try {
            const response = fetch("/process/update/sample", {
                method: 'POST',
                body: JSON.stringify({"oldTaskLabel": loadedTaskHandlerLabel,
                                    "newTaskLabel": newTaskHandlerLabel,
                                    "uuid": thisSessionUuid
                }),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response === undefined) {
                    throw new Error("/process/update/sample response not defined");
                } else if (!response.ok) {
                    throw new Error('/process/update/sample response not ok');
                }
                return response.json();
            })
            .then( data => {
                console.log(data);
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
        <DropdownButton id="dropdown-basic-button"
                    title={loadedTaskHandlerLabel}
                    onSelect={handleOnSelect}>
                    {taskHandlerLabels.map((key) => (
                        <Dropdown.Item eventKey={key} key={key}>{key}</Dropdown.Item>
                    ))}
                </DropdownButton>
    );
};

export default SwitchHandlerComponent;

import React, { useState, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { GlobalAppContext } from "../GlobalAppContext";
import { CodeContext } from "./CodeContext";
import CloseToRestartButton from "../others/CloseToRestartButton";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import './css/CodeDetail.css'
import CodeCard from "./CodeCard";

const CodeDetailComponent = ({ code }) => {
    const { isSolutionConcludeDone, referenceCodeSepOffset, isOnLoadingExecutionLog,
        referenceShellScriptResults, setIsOnLoadingExecutionLog
     } = useContext(GlobalAppContext);
    const { setIsEditingCode, isEditingCode } = useContext(CodeContext);

    const [key, setKey] = useState('code');
    const [executeError, setExecuteError] = useState('');

    const handleEditToggle = () => {
        setIsEditingCode(!isEditingCode);
    };

    const handleExecutionRequest = () => {
        try {
            setIsOnLoadingExecutionLog(true);
            const response = fetch("/process/execute", {
                method: 'POST',
                body: JSON.stringify({"shell_scripts": referenceShellScriptResults}),
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response === undefined) {
                    throw new Error("ocr json conversion response is null.");
                } else if (!response.ok) {
                    throw new Error('ocr json conversion response was not ok.');
                }
                return response.json();
            })
            .then( async (data) => {
                if (data.error !== undefined) {
                    setExecuteError(data.error);
                } else {
                    setIsOnLoadingExecutionLog(false);
                }
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
                    postErr = "Image Process Error.";
                }
                setExecuteError(postErr);
            });
        } catch (error) {
            setExecuteError(error);
        } finally {
            ;
        }
    }

    return (
        <div>
            <div className="refresh-btn-container">
            <CloseToRestartButton></CloseToRestartButton>
            </div>
            <div className="code-card-content-container"
                style={{ width: '100%', height: `${Math.min(29, 8 + referenceCodeSepOffset)}rem` }}>
                <CodeCard code={code} />
            </div>
            <Card.Footer style={{ display: "flex", justifyContent: "flex-end" }}>
                <React.Fragment>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isSolutionConcludeDone || isOnLoadingExecutionLog ? true : false}
                        className={!isSolutionConcludeDone ? "code-btn-container" : ""}
                        style={{ display: "flex", marginLeft: "1%", marginRight: "1%" }}
                        onClick={handleEditToggle}>
                        {isEditingCode ? "Save" : "Edit"}
                    </Button>
                    <OverlayTrigger placement="top" overlay={
                    <Tooltip id="button-tooltip">
                        Execute the generated scripts
                    </Tooltip>
                } >
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isSolutionConcludeDone || isOnLoadingExecutionLog ? true : false}
                        className={!isSolutionConcludeDone ? "code-btn-container" : ""}
                        style={{ display: "flex", marginLeft: "1%", marginRight: "1%" }}
                        onClick={handleExecutionRequest}
                    >
                        Execute
                    </Button>
                    </OverlayTrigger>
                </React.Fragment>

            </Card.Footer>
        </div>
    );
};

export default CodeDetailComponent;

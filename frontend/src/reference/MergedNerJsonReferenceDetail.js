import React, { useState, useEffect, useContext, } from "react";
import { Container, Button, Col, Form } from "react-bootstrap";
import "./css/ocr_results.css";

const MergedNerJsonReferenceDetail = ({ referenceMergedNerJsonResults, setReferenceMergedNerJsonResults }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [isOnHoveringText, setIsOnHoveringText] = useState(false);
    const [editRows, setEditRows] = useState(5);
    const [referenceMergedNerJsonResultText, setReferenceMergedNerJsonResultText] = useState("");

    useEffect(() => {
        let maxRow = 5;
        for (const [nerName, nerItems] of Object.entries(referenceMergedNerJsonResults)) {
            maxRow = Math.max(maxRow, Object.entries(nerItems).length);
        }
        setEditRows(maxRow + 4);
        const tmpReferenceMergedNerJsonResultText = JSON.stringify(referenceMergedNerJsonResults, null, 2);
        setReferenceMergedNerJsonResultText(tmpReferenceMergedNerJsonResultText);
    }, [referenceMergedNerJsonResults]);

    const toggleIsEditing = () => {
        setIsEditing(!isEditing);
    }

    const handleBlur = () => {
        const tmpReferenceMergedNerJsonResult = JSON.parse(referenceMergedNerJsonResultText);
        setReferenceMergedNerJsonResults(tmpReferenceMergedNerJsonResult);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const tmpReferenceMergedNerJsonResult = JSON.parse(referenceMergedNerJsonResultText);
            setReferenceMergedNerJsonResults(tmpReferenceMergedNerJsonResult);
            setIsEditing(false);
        }
    };

    const handleChange = (e) => {
        setReferenceMergedNerJsonResultText(e.target.value);
    };

    return (
        <div className="reference-detail-merged-ner-container">
            <div>
                <Container
                    className="p-3 border rounded"
                    style={{ "width": "150%" }}
                    onMouseEnter={(e) => {
                        if (!isEditing) setIsOnHoveringText(true);
                    }}
                    onMouseLeave={(e) => {
                        if (!isEditing) setIsOnHoveringText(false);
                    }}
                >
                    {isEditing ? (
                        <Form style={{ "width": "100%" }}>
                            <Form.Control
                                as="textarea"
                                value={referenceMergedNerJsonResultText}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                rows={editRows}
                            />
                        </Form>
                    ) : (
                        <div className="reference-detail-merged-ner-non-edit-container">

                            <div>
                                <pre>{referenceMergedNerJsonResultText}</pre>
                            </div>
                            <div>
                                {isOnHoveringText ? (
                                    <Button variant="primary" onClick={toggleIsEditing}>
                                        Edit
                                    </Button>) : (
                                    <p>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;</p>
                                )}</div>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default MergedNerJsonReferenceDetail;

import React, { useState, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { Form, Row, Col, Image, Alert, CloseButton } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";

const FileUploadComponent = () => {
    const { setThisFileUuid, setThisFilepath,
        inputError, setInputError, setIsSolutionShowDone
    } = useContext(GlobalAppContext);

    const [fileData, setFileData] = useState(null);
    const [fileName, setFileName] = useState('');
    const [dragging, setDragging] = useState(false);

    const handleFileUpload = (file) => {

        if (!file.type.startsWith('image/')) {
            setInputError('Only image files are supported.');
            return;
        }

        const formData = new FormData();
        if (file instanceof File || file instanceof Blob) {
            setFileData(URL.createObjectURL(file));
            setFileName(file.name);
            formData.append('file', file);
        } else {
            setInputError('Uploaded file is invalid');
            return;
        }

        const fileUuid = uuid();

        fetch('/process/fileupload?fileUuid=' + fileUuid, {
            method: 'POST',
            body: formData,
            mode: "cors",
            headers: new Headers({
                'Accept': 'application/json',
            })
        })
        .then( response => {
            if (response == undefined) {
                handleRemoveFile();
                throw new Error("file upload response is null.");
            } else if (!response.ok) {
                handleRemoveFile();
                throw new Error('file upload response was not ok');
            }
            return response.json();
        })
        .then(data => {

            if (data == undefined) {
                handleRemoveFile();
                throw new Error("file upload response has no data json.");
            }

            if (data["error"] != undefined) {
                handleRemoveFile();
                setInputError(data.error);
            } else {
                setFileName(data["filename"]);
                setThisFileUuid(data["fileUuid"]);
                setThisFilepath(data["filepath"]);
            }
        })
        .catch((error) => {
            // Handle error response
            setInputError(error);
        })
        .finally (() => {
            setIsSolutionShowDone(false);
        });
    };

    const handleFormFileUpload = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        handleFileUpload(file);
    }

    const handlePaste = (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                handleFileUpload(file);
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
        setDragging(false);
    };

    const handleRemoveFile = () => {
        setFileData(null);
        setFileName('');
    };

    return (
        <div
            onPaste={handlePaste}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                border: dragging ? '2px dashed #0d6efd' : '2px solid transparent',
                borderRadius: '5px',
                transition: 'border 0.3s',
                position: 'relative',
            }}
        >
            <Form.Group controlId="formFile" className="mb-3" encType="multipart/form-data">
                <Form.Control type="file" onChange={handleFormFileUpload} />
            </Form.Group>

            {fileData && (
                <Row className="mt-3" style={{ position: 'relative' }}>
                    <Col xs={1}>
                        <div style={{ position: 'relative' }}>
                            <Image src={fileData} thumbnail />
                            <CloseButton
                                onClick={handleRemoveFile}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>
                    </Col>
                    <Col>
                        <h5>{fileName}</h5>
                    </Col>
                </Row>
            )}

            {!fileData && (
                <p className="text-center">
                    Drag and drop a file here or click to upload.
                </p>
            )}
        </div>
    );
};

export default FileUploadComponent;

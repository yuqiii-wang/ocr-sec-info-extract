import React, { useState, useContext, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { Form, Row, Col, Image, Alert, CloseButton } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";


const FileUploadComponent = () => {
    const { setThisFileUuids, setThisFilepaths,
        inputError, setInputError, setIsSolutionShowDone
    } = useContext(GlobalAppContext);

    const [fileListData, setFileListData] = useState([]);
    const [dragging, setDragging] = useState(false);
    const fileMoreInputRef = useRef(null);

    const handleInputLabel = () => {
        if (fileMoreInputRef.current) {
            fileMoreInputRef.current.setAttribute(
            'value',
            fileListData.length > 0 ? 'Add More Files' : 'Choose File'
          );
        }
      };

    const handleFileUpload = (files) => {
        const sessionUuid = uuid();
        let fileIdx = 0;
        let fileListTmpData = [];
        let fileNameTmpList = [];
        for (let file of files) {

            if (!file.type.startsWith('image/')) {
                setInputError('Only image files are supported.');
                return;
            }

            const formData = new FormData();
            if (file instanceof File || file instanceof Blob) {
                formData.append('file', file);
            } else {
                setInputError('Uploaded file is invalid');
                return;
            }

            fetch('/process/fileupload?fileUuid=' + sessionUuid + "_" + fileIdx, {
                method: 'POST',
                body: formData,
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                })
            })
            .then( response => {
                if (response == undefined) {
                    throw new Error("file upload response is null.");
                } else if (!response.ok) {
                    throw new Error('file upload response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data == undefined) {
                    throw new Error("file upload response has no data json.");
                }

                if (data["error"] != undefined) {
                    handleRemoveFile();
                    setInputError(data.error);
                } else {
                    setThisFileUuids(data["fileUuid"]);
                    setThisFilepaths(data["filepath"]);
                }
            })
            .catch((error) => {
                // Handle error response
                setInputError(error);
            })
            .finally (() => {
                setIsSolutionShowDone(false);
            });
        }

        if (files.length) {
            const newImages = files.map((file) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve({
                    src: reader.result,
                    name: file.name
                    });
                reader.readAsDataURL(file);
              });
            });
            Promise.all(newImages).then((imageData) => {
                setFileListData((prevImages) => [...prevImages, ...imageData]);
            });
          }

        console.log(fileListTmpData);
    };

    const handleFormFileUpload = (event) => {
        event.preventDefault();
        const files = [];
        for (let file of event.target.files) {
            files.push(file);
        }
        handleFileUpload(files);
    }

    const handlePaste = (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        const fileList = [];
        for (const item of items) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                fileList.push(file);
            }
        }
        handleFileUpload(fileList);
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
        const fileList = [];
        for (let file of event.dataTransfer.files) {
            fileList.push(file)
        }
        handleFileUpload(fileList);
        setDragging(false);
    };

    const handleRemoveFile = (filename) => {
        setFileListData((prevImages) => prevImages.filter((image) => image.name !== filename));
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
                <Form.Control type="file" onChange={(e) => {
                                handleFormFileUpload(e);
                                handleInputLabel();}} 
                            ref={fileMoreInputRef}
                            multiple
                />
            </Form.Group>

            <Row className="mt-3" style={{ position: 'relative' }}>
                {fileListData.length > 0 && fileListData.map((image, idx) => (
                    <Col xs={1}>
                        <div style={{ position: 'relative' }}>
                            <Image src={image.src} thumbnail />
                            <CloseButton
                                onClick={() => handleRemoveFile(image.name)}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                }}
                            />
                        </div>
                    </Col>
                ))}
                </Row>
            

            {!fileListData.length && (
                <p className="text-center">
                    Drag and drop a file here or click to upload.
                </p>
            )}
        </div>
    );
};

export default FileUploadComponent;

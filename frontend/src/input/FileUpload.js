import React, { useState, useContext, useRef, useEffect } from 'react';
import { Form, Row, Col, Image, Modal, CloseButton } from 'react-bootstrap';
import { GlobalAppContext } from "../GlobalAppContext";


const FileUploadComponent = () => {
    const { setThisFileUuids, setUploadedFilenames, 
        thisSessionUuid, setThisSessionUuid, setIsJustStart,
        inputError, setInputError, setIsSolutionShowDone
    } = useContext(GlobalAppContext);

    const [fileListData, setFileListData] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [currentZoomedInImage, setCurrentZoomedInImage] = useState(null);
    const [imageZoomedPosition, setImageZoomedPosition] = useState({ top: 0, left: 0 });
    const [imageZoomedInSize, setImageZoomedInSize] = useState({ width: 0, height: 0 });
    const fileMoreInputRef = useRef(null);

    const handleInputLabel = () => {
        if (fileMoreInputRef.current) {
            fileMoreInputRef.current.setAttribute(
                'value',
                fileListData.length > 0 ? 'Add More Files' : 'Choose File'
            );
        }
    };

    const handleImageZoomIn = (event, imageSrc) => {
        const rect = event.target.getBoundingClientRect();
        setCurrentZoomedInImage(imageSrc);
        setImageZoomedPosition({
            top: rect.top ,
            left: rect.left ,
        });
        setImageZoomedInSize({
            width: rect.width * 4,
            height: rect.height * 4,
          });
    };

    const handleCurrentZoomedInImageClose = () => setCurrentZoomedInImage(null);

    const getFileExtension = (filename) => {
        // Split the filename at the last dot and take the last part
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
      };

    const handleFileUpload = (files) => {
        let fileIdx = fileListData.length;
        const newNameFiles = [];
        const newFilenames = [];
        for (let file of files) {

            if (!file.type.startsWith('image/')) {
                setInputError('Only image files are supported.');
                return;
            }

            const formData = new FormData();
            if (file instanceof File || file instanceof Blob) {
                // Create a new File instance with a new name
                const fileExtension = getFileExtension(file.name);
                const mainFilename = file.name.replace("."+fileExtension, "");
                const newFilename = mainFilename + "__" + thisSessionUuid + "__" + fileIdx + "." + fileExtension;
                const newFile = new File([file], newFilename, { type: file.type });
                newFilenames.push(newFilename);
                newNameFiles.push(newFile);
                formData.append('file', newFile);
            } else {
                setInputError('Uploaded file is invalid');
                return;
            }

            fetch('/process/file/upload?fileUuid=' + thisSessionUuid + "__" + fileIdx, {
                method: 'POST',
                body: formData,
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                })
            })
            .then(response => {
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
                    setInputError(data.error);
                }
            })
            .catch((error) => {
                // Handle error response
                setInputError(error);
            })
            .finally(() => {
                setIsSolutionShowDone(false);
                setIsJustStart(false);
            });
            fileIdx += 1;
        }

        if (newNameFiles.length) {
            const newImages = newNameFiles.map((file) => {
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
            setUploadedFilenames(newFilenames);
        }
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

    const handleRemoveFile = (filenameToRemove) => {
        fetch('/process/file/remove', {
            method: 'POST',
            body: JSON.stringify({"filename": filenameToRemove}),
            mode: "cors",
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            })
        })
        .then(response => {
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
                setInputError(data.error);
            }
        })
        .catch((error) => {
            // Handle error response
            setInputError(error);
        })
        .finally(() => {
            ;
        });
        setFileListData((prevImages) => prevImages.filter((image) => image.name !== filenameToRemove));
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
                    handleInputLabel();
                }}
                    ref={fileMoreInputRef}
                    multiple
                />
            </Form.Group>

            <Row className="mt-3" style={{ position: 'relative' }}>
                {fileListData.length > 0 && fileListData.map((image, idx) => (
                    <Col xs={1} key={idx}>
                        <div style={{ position: 'relative' }}>
                            <Image src={image.src} thumbnail
                                onClick={(e) => handleImageZoomIn(e, image.src)}
                                style={{
                                    cursor: 'zoom-in',
                                    transition: 'transform 0.3s ease',
                                    display: 'inline-block'
                                }} />
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
                    Drag and drop, copy and paste, or click to upload
                </p>
            )}

            {currentZoomedInImage && (
                <div
                    onClick={handleCurrentZoomedInImageClose}
                    style={{
                        position: 'absolute',
                        width: imageZoomedInSize.width,
                        height: imageZoomedInSize.height,
                        transform: 'scale(2)',
                        transformOrigin: 'bottom left',
                        zIndex: 1000,
                        cursor: 'zoom-out',
                        transition: 'transform 0.3s ease, top 0.3s ease, left 0.3s ease',
                    }}
                >
                    <Image src={currentZoomedInImage} thumbnail />
                </div>
            )}
        </div>
    );
};

export default FileUploadComponent;

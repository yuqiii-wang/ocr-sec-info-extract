import React, {useState, useContext, useEffect, useRef, useCallback, } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, } from "react-bootstrap";
import ImageReferenceDetails from "./ImageReferenceDetails";
import { GlobalAppContext } from "../GlobalAppContext";

const ReferenceComponent = () => {
    const { solutionLoading, detailResults, referenceCodeSepOffset } = useContext(GlobalAppContext);

    return (
        <Container className="image-reference-container border rounded"
        style={{height: `${Math.max(6.5, 28-referenceCodeSepOffset)}rem` }}>
                {solutionLoading ? (
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                ) : (
                    <ImageReferenceDetails />
                )}
        </Container>
    );
};

export default ReferenceComponent;

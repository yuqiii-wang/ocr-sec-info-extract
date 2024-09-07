import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card, Tab } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const CodeErrorCard = ({ errorText="N/A" }) => {

  return (
    <div className="code-card-content-container">
      <Card.Body>
      <p
            style={{ overflow: 'auto', textAlign: 'left' }}
            >
            {errorText}
            </p>
      </Card.Body>
    </div>
  );
};

export default CodeErrorCard;

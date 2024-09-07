import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card, Tab } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { GlobalAppContext } from "../GlobalAppContext";

const SummaryCard = ({ initialSummary }) => {
    const { isSolutionConcludeDone } = useContext(GlobalAppContext)

    const [summary, setSummary] = useState(initialSummary);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
      };
    
      const handleSummaryChange = (event) => {
        setSummary(event.target.value);
      };

  return (
    <div>
      <div className="code-card-content-container">
      {isEditing ? (
            <textarea
            value={summary}
            onChange={handleSummaryChange}
            style={{ width: '100%', height: '300px', fontFamily: 'monospace', padding: '10px', borderRadius: '5px' }}
            />
        ) : (
            <p
            style={{ overflow: 'auto', textAlign: 'left' }}
            >
            {summary}
            </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;

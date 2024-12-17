import React, { useContext, useState } from 'react';
import {  Row, Col, } from 'react-bootstrap';
import TextReferenceHighlights from './TextReferenceHighlights';
import { GlobalAppContext } from "../GlobalAppContext";
import "./css/ocr_results.css";

const TextReferenceDetail = ({onDelete}) => {
    const {
        referenceTextNerJsonResults,
        referenceTextNerPosResults,
        referenceSrcTextResults
    } = useContext(GlobalAppContext);

    const [hover, setHover] = useState(false);

    const localReferenceTextNerJsonResults = JSON.stringify(referenceTextNerJsonResults, null ,2);

  return (
        <Row className='reference-detail'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <Col md={7}>
                {referenceSrcTextResults !== "" 
                    ? (<TextReferenceHighlights text={referenceSrcTextResults} highlights={referenceTextNerPosResults} />)
                    : ("")}
            </Col>
            <Col md={4}>
                {localReferenceTextNerJsonResults !== "" 
                    ? (<pre>{localReferenceTextNerJsonResults}</pre>)
                    : (<p>Empty results</p>)}
            </Col>
            {hover && (
        <Col md={1}
          onClick={onDelete}
          style={{
            top: '5px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontWeight: 'bold', color: 'black' }}>&times;</span>
        </Col>
      )}
    </Row>
  );
};

export default TextReferenceDetail;

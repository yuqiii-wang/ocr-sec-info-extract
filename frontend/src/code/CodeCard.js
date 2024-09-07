import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Card, Button, Tab, Tabs } from 'react-bootstrap';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import shell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import { CodeContext } from "./CodeContext";
import './css/CodeDetail.css'

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('shell', shell);


const CodeCard = ({ language = 'javascript' }) => {
    const { code, setCode, isEditingCode } = useContext(CodeContext)


    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const handleExecutionRequest = () => { }

    return (
            <div>
            {isEditingCode ? (
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    style={{ width: '100%', fontFamily: 'monospace', padding: '10px', borderRadius: '5px' }}
                />
            ) : (
                <SyntaxHighlighter
                    language={language}
                    style={github}
                    customStyle={{ overflow: 'auto', textAlign: 'left' }}
                >
                    {code}
                </SyntaxHighlighter>
            )}
            </div>
    );
};

export default CodeCard;

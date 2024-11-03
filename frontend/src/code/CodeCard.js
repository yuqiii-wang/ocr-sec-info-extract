import React, { useState, useContext } from "react";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import shell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import { CodeContext } from "./CodeContext";
import './css/CodeDetail.css'
import { GlobalAppContext } from "../GlobalAppContext";

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('shell', shell);


const CodeCard = ({ language = 'shell' }) => {
    const { referenceShellScriptResults, setReferenceShellScriptResults,
        referenceCodeSepOffset } = useContext(GlobalAppContext);
    const { 
        isEditingCode } = useContext(CodeContext);

    const handleCodeChange = (event) => {
        setReferenceShellScriptResults(event.target.value);
    };

    return (
            <div>
            {isEditingCode ? (
                <textarea
                    value={referenceShellScriptResults}
                    onChange={handleCodeChange}
                    style={{ width: '100%', fontFamily: 'monospace', 
                        padding: '10px', borderRadius: '5px',
                        height: `${Math.min(28, 4 + referenceCodeSepOffset)}rem` }}
                />
            ) : (
                <SyntaxHighlighter
                    language={language}
                    style={github}
                    customStyle={{ overflow: 'auto', textAlign: 'left' }}
                >
                    {referenceShellScriptResults}
                </SyntaxHighlighter>
            )}
            </div>
    );
};

export default CodeCard;

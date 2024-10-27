import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import io from 'socket.io-client';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import log from 'react-syntax-highlighter/dist/esm/languages/hljs/lisp';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { GlobalAppContext } from "../GlobalAppContext";
import LoadingDots from "../others/LoadingDots";
import "./css/ocr_results.css";

SyntaxHighlighter.registerLanguage('log', log);

const LogReferenceDetail = () => {

    const { setIsDoneLoadingExecutionLog,
        isOnLoadingExecutionLog, isDoneLoadingExecutionLog,
        setIsOnLoadingExecutionLog
    } = useContext(GlobalAppContext);

    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!isOnLoadingExecutionLog) {
            return;
        }
        const socket = io('http://localhost:5000');  // URL of your Flask backend

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            setIsDoneLoadingExecutionLog(false);
            setIsOnLoadingExecutionLog(true);
        });

        socket.on('message', (message) => {
            console.log(message.data);  // Log the "end" message
            setMessages((prevMessages) => [...prevMessages, message.data]);
        });

        socket.on('end', (message) => {
            console.log(message.data);  // Log the "end" message
            setIsDoneLoadingExecutionLog(true);
            setIsOnLoadingExecutionLog(false);
            socket.disconnect();  // Close the WebSocket
            return;
        });

    }, [isOnLoadingExecutionLog]); // mounted on start

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const combinedMessages = messages.join('\n');

    return (
        <Container >
                <SyntaxHighlighter
                    language="log"
                    style={github}
                    customStyle={{marginTop: '0px', textAlign: 'left' }}
                >
                    {combinedMessages}
                </SyntaxHighlighter>
                <React.Fragment>
                { (isOnLoadingExecutionLog && !isDoneLoadingExecutionLog) ?
                (<LoadingDots></LoadingDots>) : ("") }
                </React.Fragment>
            <div ref={messagesEndRef} />
        </Container>
    );
};

export default LogReferenceDetail;

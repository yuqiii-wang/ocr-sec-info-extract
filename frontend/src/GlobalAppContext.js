import React, { createContext, useState } from 'react';

// Create a context
const GlobalAppContext = createContext();


function GlobalAppContextManager({ children }) {
    const [answerLoading, setAnswerLoading] = useState(false);
    const [isMainAskDone, setIsMainAskDone] = useState(false);
    const [isSolutionRunning, setIsSolutionRunning] = useState(false);
    const [isSolutionShowDone, setIsSolutionShowDone] = useState(false);
    const [isSolutionRunDone, setIsSolutionRunDone] = useState(false);
    const [isSolutionConcludeDone, setIsSolutionConcludeDone] = useState(false);
    const [isSolutionExecutionDone, setIsSolutionExecutionDone] = useState(false);
    const [referenceCodeSepOffset, setReferenceCodeSepOffset] = useState(0);
    const [referenceImageResults, setReferenceImageResults] = useState([]);
    const [referenceOCRJsonResults, setReferenceOCRJsonResults] = useState("");
    const [referenceShellScriptResults, setReferenceShellScriptResults] = useState("");
    const [isOnInputShow, setIsOnInputShow] = useState(true);
    const [thisFileUuid, setThisFileUuid] = useState("");
    const [thisFilepath, setThisFilepath] = useState("");
    const [inputError, setInputError] = useState("");
    const [isOnLoadingExecutionLog, setIsOnLoadingExecutionLog] = useState(false);
    const [isDoneLoadingExecutionLog, setIsDoneLoadingExecutionLog] = useState(false);
    const [isOnAuditPage, setIsOnAuditPage] = useState(false);

    return (
      <GlobalAppContext.Provider value={{answerLoading, setAnswerLoading,
                                        isMainAskDone, setIsMainAskDone,
                                        isSolutionShowDone, setIsSolutionShowDone,
                                        isSolutionRunning, setIsSolutionRunning,
                                        isSolutionRunDone, setIsSolutionRunDone,
                                        isSolutionConcludeDone, setIsSolutionConcludeDone,
                                        isSolutionExecutionDone, setIsSolutionExecutionDone,
                                        referenceCodeSepOffset, setReferenceCodeSepOffset,
                                        referenceImageResults, setReferenceImageResults,
                                        referenceOCRJsonResults, setReferenceOCRJsonResults,
                                        referenceShellScriptResults, setReferenceShellScriptResults,
                                        isOnInputShow, setIsOnInputShow,
                                        thisFileUuid, setThisFileUuid,
                                        thisFilepath, setThisFilepath,
                                        inputError, setInputError,
                                        isOnLoadingExecutionLog, setIsOnLoadingExecutionLog,
                                        isDoneLoadingExecutionLog, setIsDoneLoadingExecutionLog,
                                        isOnAuditPage, setIsOnAuditPage
                                        }}>
        {children}
      </GlobalAppContext.Provider>
    );
  }


export {GlobalAppContext, GlobalAppContextManager};

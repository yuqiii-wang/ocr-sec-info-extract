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
    const [thisFileUuids, setThisFileUuids] = useState("");
    const [thisFilepaths, setThisFilepaths] = useState("");
    const [inputError, setInputError] = useState("");
    const [isOnLoadingExecutionLog, setIsOnLoadingExecutionLog] = useState(false);
    const [isDoneLoadingExecutionLog, setIsDoneLoadingExecutionLog] = useState(false);
    const [isOnAuditPage, setIsOnAuditPage] = useState(false);
    const [isOnAboutPage, setIsOnAboutPage] = useState(false);
    const [isOnHomeStartPage, setIsOnHomeStartPage] = useState(true);
    const [isOnConfigClassifierPage, setIsOnConfigClassifierPage] = useState(false);
    const [isOnConfigNERPage, setIsOnConfigNERPage] = useState(false);
    const [isOnConfigHandlerPage, setIsOnConfigHandlerPage] = useState(false);

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
                                        thisFileUuids, setThisFileUuids,
                                        thisFilepaths, setThisFilepaths,
                                        inputError, setInputError,
                                        isOnLoadingExecutionLog, setIsOnLoadingExecutionLog,
                                        isDoneLoadingExecutionLog, setIsDoneLoadingExecutionLog,
                                        isOnAuditPage, setIsOnAuditPage,
                                        isOnAboutPage, setIsOnAboutPage,
                                        isOnHomeStartPage, setIsOnHomeStartPage,
                                        isOnConfigClassifierPage, setIsOnConfigClassifierPage,
                                        isOnConfigNERPage, setIsOnConfigNERPage,
                                        isOnConfigHandlerPage, setIsOnConfigHandlerPage
                                        }}>
        {children}
      </GlobalAppContext.Provider>
    );
  }


export {GlobalAppContext, GlobalAppContextManager};

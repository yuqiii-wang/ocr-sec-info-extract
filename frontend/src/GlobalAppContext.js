import React, { createContext, useState } from 'react';

// Create a context
const GlobalAppContext = createContext();


function GlobalAppContextManager({ children }) {
    const [isFreshStart, setIsFreshStart] = useState(false);
    const [answerLoading, setAnswerLoading] = useState(false);
    const [isMainAskDone, setIsMainAskDone] = useState(false);
    const [isSolutionRunning, setIsSolutionRunning] = useState(false);
    const [isSolutionShowDone, setIsSolutionShowDone] = useState(false);
    const [isSolutionRunDone, setIsSolutionRunDone] = useState(false);
    const [isSolutionConcludeDone, setIsSolutionConcludeDone] = useState(false);
    const [isSolutionExecutionDone, setIsSolutionExecutionDone] = useState(false);
    const [referenceCodeSepOffset, setReferenceCodeSepOffset] = useState(0);
    const [referenceImageResults, setReferenceImageResults] = useState([]);
    const [referenceOCRJsonResults, setReferenceOCRJsonResults] = useState([]);
    const [referenceTextNerJsonResults, setReferenceTextNerJsonResults] = useState([]);
    const [referenceTextNerPosResults, setReferenceTextNerPosResults] = useState([]);
    const [referenceMergedNerJsonResults, setReferenceMergedNerJsonResults] = useState([]);
    const [referenceSrcTextResults, setReferenceSrcTextResults] = useState("");
    const [referenceShellScriptResults, setReferenceShellScriptResults] = useState([]);
    const [isOnInputShow, setIsOnInputShow] = useState(true);
    const [thisFileUuids, setThisFileUuids] = useState("");
    const [uploadedFilenames, setUploadedFilenames] = useState("");
    const [thisSessionUuid, setThisSessionUuid] = useState("");
    const [approvalTemplateId, setApprovalTemplateId] = useState(-1);
    const [taskLabel, setTaskLabel] = useState("");
    const [inputError, setInputError] = useState("");
    const [isAdminUserLoginSuccess, setIsAdminUserLoginSuccess] = useState(false);
    const [isOnLoadingExecutionLog, setIsOnLoadingExecutionLog] = useState(false);
    const [isDoneLoadingExecutionLog, setIsDoneLoadingExecutionLog] = useState(false);
    const [isJustStart, setIsJustStart] = useState(true);
    const [isOnAuditPage, setIsOnAuditPage] = useState(false);
    const [isOnAboutPage, setIsOnAboutPage] = useState(false);
    const [isOnHomePage, setIsOnHomePage] = useState(true);
    const [isOnHomeAskPage, setIsOnHomeAskPage] = useState(true);
    const [isOnConfigClassifierPage, setIsOnConfigClassifierPage] = useState(false);
    const [isOnConfigNERPage, setIsOnConfigNERPage] = useState(false);
    const [isOnConfigHandlerPage, setIsOnConfigHandlerPage] = useState(false);
    const [isOnConfigApprovalPage, setIsOnConfigApprovalPage] = useState(false);

    return (
      <GlobalAppContext.Provider value={{isFreshStart, setIsFreshStart,
                                        answerLoading, setAnswerLoading,
                                        isMainAskDone, setIsMainAskDone,
                                        isSolutionShowDone, setIsSolutionShowDone,
                                        isSolutionRunning, setIsSolutionRunning,
                                        isSolutionRunDone, setIsSolutionRunDone,
                                        isSolutionConcludeDone, setIsSolutionConcludeDone,
                                        isSolutionExecutionDone, setIsSolutionExecutionDone,
                                        referenceCodeSepOffset, setReferenceCodeSepOffset,
                                        referenceImageResults, setReferenceImageResults,
                                        referenceOCRJsonResults, setReferenceOCRJsonResults,
                                        referenceTextNerJsonResults, setReferenceTextNerJsonResults,
                                        referenceTextNerPosResults, setReferenceTextNerPosResults,
                                        referenceSrcTextResults, setReferenceSrcTextResults,
                                        referenceShellScriptResults, setReferenceShellScriptResults,
                                        referenceMergedNerJsonResults, setReferenceMergedNerJsonResults,
                                        isOnInputShow, setIsOnInputShow,
                                        thisFileUuids, setThisFileUuids,
                                        approvalTemplateId, setApprovalTemplateId,
                                        uploadedFilenames, setUploadedFilenames,
                                        thisSessionUuid, setThisSessionUuid,
                                        taskLabel, setTaskLabel,
                                        inputError, setInputError,
                                        isAdminUserLoginSuccess, setIsAdminUserLoginSuccess,
                                        isOnLoadingExecutionLog, setIsOnLoadingExecutionLog,
                                        isDoneLoadingExecutionLog, setIsDoneLoadingExecutionLog,
                                        isJustStart, setIsJustStart,
                                        isOnAuditPage, setIsOnAuditPage,
                                        isOnAboutPage, setIsOnAboutPage,
                                        isOnHomePage, setIsOnHomePage,
                                        isOnHomeAskPage, setIsOnHomeAskPage,
                                        isOnConfigClassifierPage, setIsOnConfigClassifierPage,
                                        isOnConfigNERPage, setIsOnConfigNERPage,
                                        isOnConfigHandlerPage, setIsOnConfigHandlerPage,
                                        isOnConfigApprovalPage, setIsOnConfigApprovalPage
                                        }}>
        {children}
      </GlobalAppContext.Provider>
    );
  }


export {GlobalAppContext, GlobalAppContextManager};

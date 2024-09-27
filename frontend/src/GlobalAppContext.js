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
    const [isOnInputShow, setIsOnInputShow] = useState(true);
    const [thisFileUuid, setThisFileUuid] = useState("");
    const [thisFilepath, setThisFilepath] = useState("");
    const [inputError, setInputError] = useState("");

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
                                        isOnInputShow, setIsOnInputShow,
                                        thisFileUuid, setThisFileUuid,
                                        thisFilepath, setThisFilepath,
                                        inputError, setInputError
                                        }}>
        {children}
      </GlobalAppContext.Provider>
    );
  }


export {GlobalAppContext, GlobalAppContextManager};

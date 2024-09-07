import React, { createContext, useState } from 'react';

// Create a context
const CodeContext = createContext();


function CodeContextManager({ children }) {
    const [code, setCode] = useState("# Generated code will show here once concluded on logs.");
    const [codeError, setCodeError] = useState("# N/A");
    const [codeSummary, setCodeSummary] = useState("# N/A");
    const [isEditingCode, setIsEditingCode] = useState(false);
    const [isEditingCodeError, setIsEditingCodeError] = useState(false);
    const [isEditingCodeSummary, setIssEditingCodeSummary] = useState(false);
    
    return (
      <CodeContext.Provider value={{ code, setCode,
                                    codeError, setCodeError,
                                    codeSummary, setCodeSummary,
                                    isEditingCode, setIsEditingCode,
                                    isEditingCodeError, setIsEditingCodeError,
                                    isEditingCodeSummary, setIssEditingCodeSummary
                                        }}>
        {children}
      </CodeContext.Provider>
    );
  }


export {CodeContext, CodeContextManager};

import React, { createContext, useState } from 'react';

// Create a context
const CodeContext = createContext();


function CodeContextManager({ children }) {
    const [code, setCode] = useState("# Generated code will show here once concluded on logs.");
    const [isEditingCode, setIsEditingCode] = useState(false);
    
    return (
      <CodeContext.Provider value={{ code, setCode,
                                    isEditingCode, setIsEditingCode,
                                        }}>
        {children}
      </CodeContext.Provider>
    );
  }


export {CodeContext, CodeContextManager};

import "./App.css";
import App from "./App";
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { GlobalAppContext, GlobalAppContextManager } from "./GlobalAppContext";

function AppWrapper() {

  return (
    <GlobalAppContextManager className="App">
      <App></App>
    </GlobalAppContextManager>
  );
}

export default AppWrapper;

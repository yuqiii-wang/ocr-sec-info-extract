import "./App.css";
import App from "./App";
import React from "react";
import { GlobalAppContextManager } from "./GlobalAppContext";

function AppWrapper() {

  return (
    <GlobalAppContextManager className="App">
      <App></App>
    </GlobalAppContextManager>
  );
}

export default AppWrapper;

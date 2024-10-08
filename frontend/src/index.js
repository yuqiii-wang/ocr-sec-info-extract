import React from 'react';
import { render } from "react-dom";
import './index.css';
import AppWrapper from './AppWrapper';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = document.getElementById("root");
render(
    <AppWrapper />,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

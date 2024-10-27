import "./App.css";
import TopNavBar from "./TopNavBar";
import ReferenceComponent from "./reference";
import ComponentSepLine from "./others/ComponentSepLine";
import InputOrCodeDisplayWrapper from "./InputOrCodeDisplay";
import AuditChartByTimeCategory from "./audit/AuditChartByTimeCategory";
import ConfigIndexComponent from "./config/Index";
import AboutPage from "./about/About";
import React, {  useContext, } from "react";
import { GlobalAppContext } from "./GlobalAppContext";

function App() {

    const { isOnAuditPage, isOnAboutPage,
        isOnConfigClassifierPage,
        isOnConfigNERPage,
        isOnConfigHandlerPage
     } = useContext(GlobalAppContext);

    return (
        <React.Fragment>
            <TopNavBar />
            {(isOnConfigClassifierPage || isOnConfigNERPage || isOnConfigHandlerPage) ? (
                <ConfigIndexComponent></ConfigIndexComponent>
            ) : (isOnAuditPage) ? (
                <AuditChartByTimeCategory></AuditChartByTimeCategory>
            ) : isOnAboutPage ? (
                <AboutPage></AboutPage>
            ) : (
                <React.Fragment>
                    <ReferenceComponent></ReferenceComponent>
                    <ComponentSepLine></ComponentSepLine>
                    <InputOrCodeDisplayWrapper></InputOrCodeDisplayWrapper>
                </React.Fragment>)}
        </React.Fragment>);
}

export default App;

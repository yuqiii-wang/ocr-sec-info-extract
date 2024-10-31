import "./App.css";
import { v4 as uuid } from 'uuid';
import TopNavBar from "./TopNavBar";
import ReferenceComponent from "./reference";
import ComponentSepLine from "./others/ComponentSepLine";
import InputOrCodeDisplayWrapper from "./InputOrCodeDisplay";
import AuditChartByTimeCategory from "./audit/AuditChartByTimeCategory";
import ConfigIndexComponent from "./config/Index";
import AboutPage from "./about/About";
import React, {  useContext, useEffect } from "react";
import { GlobalAppContext } from "./GlobalAppContext";

function App() {

    const { isOnHomePage,
        isOnAuditPage, isOnAboutPage,
        isOnConfigClassifierPage,
        isOnConfigNERPage,
        isOnConfigHandlerPage,
        setThisSessionUuid
     } = useContext(GlobalAppContext);


    useEffect(() => {
        // when there is a refresh/reloading of the component,
        // consider it as a start of a new session
        const sessionUuid = uuid();
        setThisSessionUuid(sessionUuid);

        try {
            const response = fetch("/new/session?" + "session_uuid=" + sessionUuid, {
                method: 'GET',
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
            })
            .then( response => {
                if (response == undefined) {
                    throw new Error("classifier config loading response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config loading response was not ok.');
                }
                return response.json();
            })
            .then( (data) => {
                ;
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr == "") {
                    postErr = "New session error.";
                }
            });
        } catch (error) {
            ;
        } finally {
            ;
        }
      }, []);

    return (
        <React.Fragment>
            <TopNavBar />
            <div hidden={!(isOnConfigClassifierPage || isOnConfigNERPage || isOnConfigHandlerPage)}>
                <ConfigIndexComponent ></ConfigIndexComponent>
                </div>

                <div hidden={!isOnAuditPage}>
                    <AuditChartByTimeCategory ></AuditChartByTimeCategory>
                </div>

              <div hidden={!isOnAboutPage}>
                <AboutPage></AboutPage>
              </div>
            
                <div hidden={!isOnHomePage}>
                    <ReferenceComponent></ReferenceComponent>
                    <ComponentSepLine></ComponentSepLine>
                    <InputOrCodeDisplayWrapper></InputOrCodeDisplayWrapper>
                </div>
        </React.Fragment>);
}

export default App;

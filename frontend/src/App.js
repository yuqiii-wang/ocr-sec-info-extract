import "./App.css";
import { v4 as uuid } from 'uuid';
import TopNavBar from "./TopNavBar";
import ReferenceComponent from "./reference";
import ComponentSepLine from "./others/ComponentSepLine";
import InputOrCodeDisplayWrapper from "./InputOrCodeDisplay";
import AuditChartByTimeCategory from "./audit/AuditChartByTimeCategory";
import ConfigIndexComponent from "./config/Index";
import AboutPage from "./about/About";
import ErrorBar from './others/ErrorBar';
import FreshStartPage from "./input/FreshStartPage";
import React, {  useContext, useEffect, useState } from "react";
import { GlobalAppContext } from "./GlobalAppContext";

function App() {

    const { isFreshStart, isOnHomePage,
        isOnAuditPage, isOnAboutPage,
        isOnConfigClassifierPage,
        isOnConfigNERPage,
        isOnConfigHandlerPage,
        setThisSessionUuid,
        dbHealthCheckErrorMsg, setDbHealthCheckErrorMsg
     } = useContext(GlobalAppContext);

    const [checkDBHealthCount, setCheckDBHealthCount] = useState(0);


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
                if (response === undefined) {
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
                if (postErr === "") {
                    postErr = "New session error.";
                }
            });
        } catch (error) {
            ;
        } finally {
            ;
        }

        try {
            const response = fetch("/check/elasticsearch-db-health", {
                method: 'GET',
                mode: "cors",
                headers: new Headers({
                    'Accept': 'application/json',
                }),
            })
            .then( response => {
                if (response === undefined) {
                    throw new Error("classifier config loading response is null.");
                } else if (!response.ok) {
                    throw new Error('classifier config loading response was not ok.');
                }
                return response.json();
            })
            .then( (data) => {
                if (data.status !== "green") {
                    setDbHealthCheckErrorMsg("DB HealthCheck Error: \n" + data.error);
                }
            })
            .catch((postErr) => {
                // Handle error response
                if (postErr === "") {
                    setDbHealthCheckErrorMsg("DB HealthCheck Error");
                }
            });
        } catch (error) {
            setDbHealthCheckErrorMsg(error);
        } finally {
            ;
        }
      }, []);

    return (
        <React.Fragment>
            <TopNavBar />
            {dbHealthCheckErrorMsg !== "" && <ErrorBar message={dbHealthCheckErrorMsg} duration={60000}></ErrorBar>}
            <div hidden={!(isOnConfigClassifierPage || isOnConfigNERPage || isOnConfigHandlerPage)}>
                <ConfigIndexComponent ></ConfigIndexComponent>
                </div>

                <div hidden={!isOnAuditPage}>
                    <AuditChartByTimeCategory ></AuditChartByTimeCategory>
                </div>

              <div hidden={!isOnAboutPage}>
                <AboutPage></AboutPage>
              </div>
            
            {isFreshStart ? (<div hidden={!isOnHomePage}>
                    <FreshStartPage></FreshStartPage>
                </div>) : (<div hidden={!isOnHomePage}>
                    <ReferenceComponent></ReferenceComponent>
                    <ComponentSepLine></ComponentSepLine>
                    <InputOrCodeDisplayWrapper></InputOrCodeDisplayWrapper>
                </div>)
            }
        </React.Fragment>);
}

export default App;

import React, { useContext, } from "react";
import { Container, Spinner, } from "react-bootstrap";
import ConfigClassifierPage from "./ConfigClassifierPage";
import ConfigNERPage from "./ConfigNERPage";
import ConfigHandlerPage from "./ConfigHandlerPage";
import ConfigApprovalPage from "./ConfigApprovalPage";
import { GlobalAppContext } from "../GlobalAppContext";


const ConfigIndexComponent = () => {
    const { isOnConfigClassifierPage,
        isOnConfigNERPage,
        isOnConfigHandlerPage,
        isOnConfigApprovalPage
     } = useContext(GlobalAppContext);

    return (
        <Container>
            {isOnConfigClassifierPage ? (
                <ConfigClassifierPage />
            ) : (isOnConfigNERPage) ? (
                <ConfigNERPage />
            ) : (isOnConfigHandlerPage) ? (
                <ConfigHandlerPage />
            ) : (isOnConfigApprovalPage 
                && <ConfigApprovalPage/>
            )}
        </Container>
    );
};

export default ConfigIndexComponent;

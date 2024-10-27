import React, { useContext, } from "react";
import { Container, Spinner, } from "react-bootstrap";
import ConfigClassifierPage from "./ConfigClassifierPage";
import ConfigNERPage from "./ConfigNERPage";
import ConfigHandlerPage from "./ConfigHandlerPage";
import { GlobalAppContext } from "../GlobalAppContext";


const ConfigIndexComponent = () => {
    const { isOnConfigClassifierPage,
        isOnConfigNERPage,
        isOnConfigHandlerPage
     } = useContext(GlobalAppContext);

    return (
        <Container>
            {isOnConfigClassifierPage ? (
                <ConfigClassifierPage />
            ) : (isOnConfigNERPage) ? (
                <ConfigNERPage />
            ) : (isOnConfigHandlerPage) && (
                <ConfigHandlerPage />
            )}
        </Container>
    );
};

export default ConfigIndexComponent;

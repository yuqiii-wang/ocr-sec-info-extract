import React, { useContext, } from "react";
import { Container, } from "react-bootstrap";
import TextAsk from "../input/TextAsk";
import InputComponent from ".";


const FreshStartPage = () => {

    return (
        <Container className="border rounded"
            style={{"height": "40rem",
        }}>
             <TextAsk></TextAsk>
             <InputComponent></InputComponent>
        </Container>
    );
};

export default FreshStartPage;

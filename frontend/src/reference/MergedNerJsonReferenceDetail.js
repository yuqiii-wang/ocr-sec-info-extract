import React, { useState, useEffect, useContext, } from "react";
import { Container, Button, DropdownButton, Dropdown } from "react-bootstrap";

const MergedNerJsonReferenceDetail = ({referenceMergedNerJsonResults}) => {
    return (
        <Container>
            <pre>{
                JSON.stringify(referenceMergedNerJsonResults, null, 2)
            }</pre>
        </Container>
    );
}

export default MergedNerJsonReferenceDetail;

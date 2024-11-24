import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import "./css/Config.css";

const ConfigHandlerTransformRuleComponent = ({ transformItems, setTransformItems,
    isEnabledEditing, transformItemLambdaNames,
    setTransformItemLambdaNames, isSetupTransformItems,
    setIsSetupTransformItems,
    nerNames, setNerNames, nerTaskItemLabels }) => {

    // static mapping key
    const [thisNerNameDisplayColSize, setThisNerNameDisplayColSize] = useState(3);
    const [thisLambdaNameDisplayColSize, setThisLambdaNameDisplayColSize] = useState(3);
    const [thisNerName, setThisNerName] = useState("");
    const [thisTransformName, setThisTransformName] = useState("");
    const [thisTransformJsonValue, setThisTransformJsonValue] = useState("");
    const [remainedNerTaskItemLabels, setRemainedNerTaskItemLabels] = useState([]);

    // only on first time mount
    useEffect(() => {
        if (!isSetupTransformItems) {
            return;
        }

        setThisNerName(nerNames[0]);
        if (nerNames[0].length > 30) {
            setThisNerNameDisplayColSize(4);
        } else {
            setThisNerNameDisplayColSize(3);
        }

        setThisTransformName(transformItemLambdaNames[0]);

        let tmpTransformJsonValue = "";
        if (transformItemLambdaNames[0] === "datetime") {
            tmpTransformJsonValue = transformItems[nerNames[0]][transformItemLambdaNames[0]];
        } else if (transformItemLambdaNames[0] === "static_mapping") {
            tmpTransformJsonValue = JSON.stringify(transformItems[nerNames[0]][transformItemLambdaNames[0]]
                                                    , null, 2);
        }

        setThisTransformJsonValue(tmpTransformJsonValue);

        const tmpRemainedNerTaskItemLabels = nerTaskItemLabels.filter(nerTaskItemLabel => !nerNames.includes(nerTaskItemLabel));
        setRemainedNerTaskItemLabels([...tmpRemainedNerTaskItemLabels]);

        setIsSetupTransformItems(false); // done setup
    }, [transformItems, isSetupTransformItems]);

    const handleUpdateNerName = (eKeyNerName) => {
        setThisNerName(eKeyNerName);
        if (eKeyNerName.length > 30) {
            setThisNerNameDisplayColSize(4);
        } else {
            setThisNerNameDisplayColSize(3);
        }
        Object.entries(transformItems[eKeyNerName]).map(([transformLambdaName, transformLambdaValue]) => {
            let tmpTransformJsonValue = "";
            if (transformLambdaName === "datetime") {
                tmpTransformJsonValue = transformItems[eKeyNerName][transformLambdaName];
            } else if (transformLambdaName === "static_mapping") {
                tmpTransformJsonValue = JSON.stringify(transformItems[eKeyNerName][transformLambdaName]
                                                        , null, 2);
            }
            setThisTransformName(transformLambdaName);
            setThisTransformJsonValue(tmpTransformJsonValue);
        });
    }

    const handleUpdateTransformItemLambdaName = (eKeyLambdaName) => {
        let tmpTransformItems = transformItems;
        if (tmpTransformItems[thisNerName][eKeyLambdaName] === undefined) {
            if (eKeyLambdaName === "datetime") {
                tmpTransformItems[thisNerName][eKeyLambdaName] = "";
            } else if (eKeyLambdaName === "static_mapping") {
                tmpTransformItems[thisNerName][eKeyLambdaName] = {};
            }
        }
        let index = 0;
        for (let tmpNerName of nerNames) {
            if (tmpNerName === thisNerName) {
                break;
            }
            index += 1;
        };
        let tmpTransformItemLambdaNames = transformItemLambdaNames;
        tmpTransformItemLambdaNames[index] = eKeyLambdaName;
        setTransformItemLambdaNames(tmpTransformItemLambdaNames);

        setThisTransformName(eKeyLambdaName);
        let tmpTransformJsonValue = "";
        if (eKeyLambdaName === "datetime") {
            tmpTransformJsonValue = transformItems[thisNerName][eKeyLambdaName];
        } else if (eKeyLambdaName === "static_mapping") {
            tmpTransformJsonValue = JSON.stringify(transformItems[thisNerName][eKeyLambdaName]
                                                    , null, 2);
        }
        setThisTransformJsonValue(tmpTransformJsonValue);
        setTransformItems({...tmpTransformItems});
    }

    const handleUpdateTransformValue = (e) => {
        let isValidTransformValue = false;
        let tmpTransformItems = transformItems;
        setThisTransformJsonValue(e.target.value);
        if (thisTransformName === "datetime") {
            isValidTransformValue = validateDatetime();
            if (isValidTransformValue) {
                tmpTransformItems[thisNerName][thisTransformName] = thisTransformJsonValue;
            }
        } else if (thisTransformName === "static_mapping") {
            try {
                isValidTransformValue = validateStaticMappingJsonValue();
                if (isValidTransformValue) {
                    tmpTransformItems[thisNerName][thisTransformName] = JSON.parse(thisTransformJsonValue);
                }
            } catch (error) {
                ;
            } finally {
                ;
            }
        }
        if (isValidTransformValue) {
            setTransformItems({...tmpTransformItems});
        }
    }

    const handleAddNewTransform = (eKeyNerName) => {
        let tmpTransformItems = transformItems;
        tmpTransformItems[eKeyNerName] = {"static_mapping": {}};
        setNerNames([...nerNames, eKeyNerName]);
        setTransformItemLambdaNames([...transformItemLambdaNames, "static_mapping"]);
        setThisNerName(eKeyNerName);
        setThisTransformName("static_mapping");
        setThisTransformJsonValue(JSON.stringify({}, null, 2));
        setTransformItems(tmpTransformItems);
    }

    const validateDatetime = () => {
        if (thisTransformName !== "datetime") {
            return true;
        }
        const regex = /[\%]/;
        return regex.test(thisTransformJsonValue);
    };

    const validateStaticMappingJsonValue = () => {
        if (thisTransformName !== "static_mapping") {
            return true;
        }

        let isValidTransformValue = false;
        try {
            JSON.parse(thisTransformJsonValue);
            isValidTransformValue = true;
        } catch (error) {
            ;
        } finally {
            ;
        }
        return isValidTransformValue;
    };

    return (
        <div>
        <Row>
            <Col md={thisNerNameDisplayColSize} >
            <DropdownButton
                id="dropdown-basic-button"
                title={thisNerName}
                onSelect={(eKey) => handleUpdateNerName(eKey)}
            >
                {Object.entries(transformItems).map(([nerName, transformLambda], index) => (
                    <Dropdown.Item eventKey={nerName} key={nerName} >{nerName}</Dropdown.Item>
                ))}
            </DropdownButton>
            </Col>
            <Col md={thisLambdaNameDisplayColSize} >
                <Form.Group >
                <DropdownButton
                    id="dropdown-basic-button"
                    title={thisTransformName}
                    onSelect={(eKey) => handleUpdateTransformItemLambdaName(eKey)}
                    disabled={!isEnabledEditing}
                >
                    <Dropdown.Item eventKey="datetime" key="datetime" >datetime</Dropdown.Item>
                    <Dropdown.Item eventKey="static_mapping" key="static_mapping" >static_mapping</Dropdown.Item>
                </DropdownButton>
            </Form.Group>
            </Col>
            <Col md="6">
                <Form.Group as={Col} controlId="formNERName">
                    <Form.Control
                        value={thisTransformJsonValue}
                        as="textarea"
                        rows={5}
                        disabled={!isEnabledEditing}
                        isInvalid={!validateDatetime() || !validateStaticMappingJsonValue()}
                        onChange={handleUpdateTransformValue}
                    />
                    {thisTransformName === "datetime" &&
                    <Form.Control.Feedback type="invalid">
                        Must be <i>strftime</i>-compliant.
                        Reference: https://strftime.org
                    </Form.Control.Feedback>}
                    {thisTransformName === "static_mapping" &&
                    <Form.Control.Feedback type="invalid">
                        Must be a single-level json, e.g., {`{"US Dollar": "USD", "$": "USD"}`}
                    </Form.Control.Feedback>}
                </Form.Group>
            </Col>
        </Row>
        <DropdownButton
                id="dropdown-basic-button"
                title="+"
                onSelect={(eKey) => handleAddNewTransform(eKey)}
                hidden={!isEnabledEditing}
            >
                {remainedNerTaskItemLabels.map((remainedNerTaskItemLabel, index) => (
                    <Dropdown.Item eventKey={remainedNerTaskItemLabel} key={remainedNerTaskItemLabel} >
                        {remainedNerTaskItemLabel}
                    </Dropdown.Item>
                ))}
            </DropdownButton>
        </div>
    );
};

export default ConfigHandlerTransformRuleComponent;

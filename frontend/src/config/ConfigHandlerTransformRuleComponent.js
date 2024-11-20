import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton, Col } from 'react-bootstrap';
import "./css/Config.css";

const ConfigHandlerTransformRuleComponent = ({ transformItems, setTransformItems,
    isEnabledEditing, transformItemLambdaNames,
    setTransformItemLambdaNames, isSetupTransformItems,
    setIsSetupTransformItems,
    nerNames, setNerNames }) => {

    // static mapping key
    const [staticMappingKeyFields, setStaticMappingKeyFields] = useState({});
    const [staticMappingValFields, setStaticMappingValFields] = useState({});

    useEffect(() => {
        if (!isSetupTransformItems) {
            return;
        }
        let tmpStaticMappingKeyFields = {};
        let tmpStaticMappingValFields = {};
        Object.entries(transformItems).map(([transformNerName, transformItemLambdas], index) => {
            if (JSON.parse(JSON.stringify(transformItemLambdaNames[index])) === "datetime") {
                tmpStaticMappingValFields[[nerNames[index], "datetime"].join(",")] = transformItems[nerNames[index]]["datetime"]
            } else if (JSON.parse(JSON.stringify(transformItemLambdaNames[index])) === "static_mapping") {
                Object.entries(transformItems[nerNames[index]]["static_mapping"]).map(([transformItemLambdaItemKey, transformItemLambdaItemVal], staticMappingKeyIndex) => {
                    tmpStaticMappingKeyFields[[nerNames[index], "static_mapping", transformItemLambdaItemKey].join(",")]
                        = transformItemLambdaItemKey;
                    tmpStaticMappingValFields[[nerNames[index], "static_mapping", transformItemLambdaItemKey].join(",")]
                        = transformItemLambdaItemVal;
                });
            }
        });
        setStaticMappingKeyFields({ ...tmpStaticMappingKeyFields });
        setStaticMappingValFields({ ...tmpStaticMappingValFields });
        setIsSetupTransformItems(false); // done setup
    }, [transformItems, isSetupTransformItems]);

    const handleAddStaticMappingItem = () => {
        let tmpTransformItems = transformItems;
        tmpTransformItems[""] = { "static_mapping": { "": "" } };
        let tmpStaticMappings = tmpTransformItems[""]["static_mapping"];
        tmpStaticMappings[""] = "";
        let tmpStaticMappingKeyFields = staticMappingKeyFields;
        tmpStaticMappingKeyFields[["", "static_mapping", staticMappingKeyFields.length].join(",")] = "";
        setStaticMappingKeyFields({ ...tmpStaticMappingKeyFields });
        setTransformItems(tmpTransformItems);
    };

    const handleUpdateNerName = (e, index) => {
        const updatedListItems = nerNames;
        updatedListItems[index] = e.target.value;
        setNerNames([...updatedListItems]);
    }

    const handleUpdateTransformItemLambdaName = (eKey, index, nerName) => {
        const updatedListItems = transformItemLambdaNames;
        updatedListItems[index] = eKey;
        setTransformItemLambdaNames([...updatedListItems]);

        let tmpTransformItems = transformItems;
        if (tmpTransformItems[nerName][eKey] === undefined) {
            if (eKey === "datetime") {
                tmpTransformItems[nerName]["datetime"] = "%Y-%m-%d";
                const updatedMapItems = staticMappingValFields;
                updatedMapItems[[nerNames[index], transformItemLambdaNames[index]].join(",")] = "%Y-%m-%d";
                setStaticMappingValFields({ ...updatedMapItems });
            } else if (eKey === "static_mapping") {
                tmpTransformItems[nerName]["static_mapping"] = { "": "" };
                const updatedMapKeyItems = staticMappingKeyFields;
                updatedMapKeyItems[[nerNames[index], transformItemLambdaNames[index], updatedMapKeyItems.length].join(",")] = "Default";
                setStaticMappingKeyFields({ ...updatedMapKeyItems });
                const updatedMapValItems = staticMappingValFields;
                updatedMapValItems[[nerNames[index], transformItemLambdaNames[index], updatedMapValItems.length].join(",")] = "";
                setStaticMappingValFields({ ...updatedMapValItems });
            }
        }
        setTransformItems(tmpTransformItems);
    }

    const handleUpdateStaticMappingKey = (e, index, keyItemVal) => {
        const updatedMapItems = staticMappingKeyFields;
        updatedMapItems[[nerNames[index], "static_mapping", keyItemVal].join(",")] = e.target.value;
        setStaticMappingKeyFields({ ...updatedMapItems });
        let tmpTransformItems = transformItems;
        const itemKey = e.target.value;
        const prevItemVal = tmpTransformItems[nerNames[index]]["static_mapping"][itemKey];
        tmpTransformItems[nerNames[index]]["static_mapping"][itemKey] = prevItemVal;
        setTransformItems({ ...tmpTransformItems });
    }

    const handleUpdateStaticMappingValue = (e, index, keyItemVal) => {
        const updatedMapItems = staticMappingValFields;
        updatedMapItems[[nerNames[index], "static_mapping", keyItemVal].join(",")] = e.target.value;
        setStaticMappingValFields({ ...updatedMapItems });
        let tmpTransformItems = transformItems;
        const itemVal = e.target.value;
        tmpTransformItems[nerNames[index]]["static_mapping"]
        [staticMappingKeyFields[[nerNames[index], "static_mapping", keyItemVal].join(",")]] = itemVal;
        setTransformItems({ ...tmpTransformItems });
    }

    const handleUpdateDatetimeValue = (e, index) => {
        const updatedMapItems = staticMappingValFields;
        updatedMapItems[[nerNames[index], "datetime"].join(",")] = e.target.value;
        setStaticMappingValFields({ ...updatedMapItems });
        let tmpTransformItems = transformItems;
        const itemVal = e.target.value;
        tmpTransformItems[nerNames[index]]["datetime"] = itemVal;
        setTransformItems({ ...tmpTransformItems });
    }

    return (
        <div>
            {nerNames.map((nerName, index) => (
                <div className="transform-rule-wrapper" key={index}>
                    <Col md={3} >
                        <Form.Group >
                            <Form.Control key={index}
                                as="textarea"
                                value={nerName}
                                onChange={(e) => handleUpdateNerName(e, index)}
                                rows={1}
                                disabled={!isEnabledEditing}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3} >
                        <Form.Group >
                            <DropdownButton key={index}
                                id="dropdown-basic-button"
                                title={transformItemLambdaNames[index] !== undefined ? transformItemLambdaNames[index] : ""}
                                onSelect={(eKey) => handleUpdateTransformItemLambdaName(eKey, index, nerName)}
                                disabled={!isEnabledEditing}
                            >
                                <Dropdown.Item eventKey="datetime" key="datetime" >datetime</Dropdown.Item>
                                <Dropdown.Item eventKey="static_mapping" key="static_mapping" >static_mapping</Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>
                    </Col>

                    {(transformItemLambdaNames[index] === "datetime") ? (
                        <div className='transform-rule-key-val-wrapper' key={[nerName, index, "datetime-wrapper"].join(",")}>
                            <Col md={12} >
                                <Form.Group >
                                    <Form.Control
                                        key={[nerNames[index], "datetime"].join(",")}
                                        as="textarea"
                                        value={staticMappingValFields[[nerNames[index], "datetime"].join(",")]}
                                        rows={1}
                                        disabled={!isEnabledEditing}
                                        onChange={(e) => handleUpdateDatetimeValue(e, index)}
                                    />
                                </Form.Group>
                            </Col>
                        </div>
                    ) : (transformItemLambdaNames[index] === "static_mapping") ? (
                        <div key={[nerName, index, "key-val-wrapper"].join(",")}>
                            {Object.entries(staticMappingKeyFields).map(([keyItemKey, keyItemVal], staticMappingKeyIndex) => {
                                if (keyItemKey.includes(nerName)) {
                                    return (
                                        <div className='transform-rule-key-val-wrapper' key={[nerName, index, "key-val", staticMappingKeyIndex].join(",")}>
                                            <Col md={5} key={[nerName, index, "key-col", staticMappingKeyIndex].join(",")}>
                                                {keyItemVal === "Default" ? (
                                                    <Form.Group >
                                                        <Form.Label key={[nerName, index, "key-val-default", staticMappingKeyIndex].join(",")}>
                                                            Default
                                                        </Form.Label>
                                                    </Form.Group>
                                                ) : (<Form.Group >
                                                    <Form.Control key={[nerName, index, "key", staticMappingKeyIndex].join(",")}
                                                        as="textarea"
                                                        value={keyItemVal}
                                                        rows={1}
                                                        disabled={!isEnabledEditing}
                                                        onChange={(e) => handleUpdateStaticMappingKey(e, index, keyItemVal)}
                                                    />
                                                </Form.Group>)}
                                            </Col>
                                            as
                                            {Object.entries(staticMappingValFields).map(([valItemKey, valItemVal], staticMappingValIndex) => {
                                                if (valItemKey === keyItemKey) {
                                                    return (
                                                        <Col md={5} key={[nerName, index, "val-col", staticMappingValIndex].join(",")}>
                                                            <Form.Group >
                                                                <Form.Control key={[nerName, index, "val", staticMappingValIndex].join(",")}
                                                                    as="textarea"
                                                                    value={valItemVal}
                                                                    rows={1}
                                                                    disabled={!isEnabledEditing}
                                                                    onChange={(e) => handleUpdateStaticMappingValue(e, index, keyItemVal)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    );
                                                }
                                            })}
                                        </div>
                                    );}
                                }
                                )}
                        <Button variant="primary" onClick={() => handleAddStaticMappingItem(nerName)} 
                            hidden={!isEnabledEditing} key={[nerName, index, "key-val-button"].join(",")}>
                            +
                        </Button>   
                        </div>) : ("")}
                </div>))}

            <Button variant="primary" onClick={handleAddStaticMappingItem} hidden={!isEnabledEditing}>
                +
            </Button>
        </div>
    );
};

export default ConfigHandlerTransformRuleComponent;

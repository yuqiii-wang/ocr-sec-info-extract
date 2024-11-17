import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton, Col } from 'react-bootstrap';
import "./css/Config.css";

const ConfigHandlerTransformRuleComponent = ({transformItems, setTransformItems, 
                                            isEnabledEditing, transformItemLambdaNames, 
                                            setTransformItemLambdaNames, isSetupTransformItems,
                                            setIsSetupTransformItems,
                                            nerNames, setNerNames}) => {
    const [tmpEditingText, setTmpEditingText] = useState("");

    // key is editable text field key, maps to if this field is onFocus
    const [isOnFocusFields, setIsOnFocusFields] = useState({});
    const [textOnFocusFields, setTextOnFocusFields] = useState({});

    const handleAddStaticMappingItem = (nerName) => {
        let tmpTransformItems = transformItems;
        let tmpStaticMappings = tmpTransformItems[nerName]["static_mapping"];
        tmpStaticMappings[""]= "";
        tmpTransformItems[nerName]["static_mapping"] = tmpStaticMappings;
        setTransformItems(tmpTransformItems);
    };

    const handleBlur = (fieldKey) => {
        let tmpIsOnFocusFields = isOnFocusFields;
        tmpIsOnFocusFields[fieldKey] = false;
        setIsOnFocusFields(tmpIsOnFocusFields);
    };

    const handleFocus = (fieldKey) => {
        let tmpIsOnFocusFields = isOnFocusFields;
        tmpIsOnFocusFields[fieldKey] = true;
        setIsOnFocusFields(tmpIsOnFocusFields);
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
            } else if (eKey === "static_mapping") {
                tmpTransformItems[nerName]["static_mapping"] = {"Default": ""};
            }
        }
        setTransformItems(tmpTransformItems);
    }

    const handleUpdateStaticMappingKey = (e, nerName, index, itemKey, fieldKey) => {
        let tmpTextOnFocusFields = textOnFocusFields;
        tmpTextOnFocusFields[fieldKey] = e.target.value;
        setTextOnFocusFields(tmpTextOnFocusFields);
        let tmpTransformItems = transformItems;
        const itemVal = tmpTransformItems[nerName][transformItemLambdaNames[index]][itemKey];
        delete tmpTransformItems[nerName][transformItemLambdaNames[index]][tmpEditingText];
        tmpTransformItems[nerName][transformItemLambdaNames[index]][e.target.value] = itemVal;
        setTmpEditingText(e.target.value);
    }

    const handleUpdateStaticMappingValue = (e, nerName, index, itemKey) => {
        let tmpTransformItems = transformItems;
        const itemVal = e.target.value;
        tmpTransformItems[nerName][transformItemLambdaNames[index]][itemKey] = itemVal;
        setTmpEditingText(itemVal);
        setTransformItems({...tmpTransformItems});
    }

    const handleUpdateDatetimeValue = (e, nerName, index) => {
        let tmpTransformItems = transformItems;
        const itemVal = e.target.value;
        console.log(itemVal);
        tmpTransformItems[nerName][transformItemLambdaNames[index]] = itemVal;
        setTransformItems({...tmpTransformItems});
        console.log(transformItemLambdaNames);
    }

  return (
    <div>
    {Object.entries(transformItems).map(([nerName, transformItem], index) => (
    <div className="transform-rule-wrapper" key={nerName}>
        <Col md={3} key={nerName}>
        <Form.Group key={nerName}>
          <Form.Control  key={nerName}
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
          <DropdownButton 
            key={transformItemLambdaNames[index]}
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

        { (typeof transformItem[transformItemLambdaNames[index]] === "string") ? (
            <div className='transform-rule-key-val-wrapper' >
            <Col md={12} >
            <Form.Group >
                <Form.Control
                key={nerName+transformItemLambdaNames[index]}
                as="textarea"
                value={transformItem[transformItemLambdaNames[index]]}
                rows={1}
                disabled={!isEnabledEditing}
                onChange={(e) => handleUpdateDatetimeValue(e, nerName, index)}
                />
          </Form.Group>
          </Col>
          </div>
        ) : (transformItem[transformItemLambdaNames[index]] instanceof Object) ? (
        <div >
            {Object.entries(transformItem[transformItemLambdaNames[index]]).map(([itemKey, itemVal], staticMappingIndex) => (
                    <div className='transform-rule-key-val-wrapper' key={[nerName, "keyval", staticMappingIndex].join(",")}>
                        <Col md={5} >
                        {itemKey === "Default" ? (
                            <Form.Group  >
                                <Form.Label>Default</Form.Label>
                            </Form.Group>
                        ) : (<Form.Group >
                            <Form.Control  key={[nerName, "key", staticMappingIndex].join(",")}
                            as="textarea"
                            value={itemKey}
                            rows={1}
                            disabled={!isEnabledEditing}
                            onChange={(e) => handleUpdateStaticMappingKey(e, nerName, index, itemKey, [nerName, itemKey].join(","))}
                        />
                        </Form.Group>)}
                        </Col>
                        as
                        <Col md={5}>
                        <Form.Group >
                            <Form.Control  key={[nerName, itemKey, "val" , staticMappingIndex].join(",")}
                                as="textarea"
                                value={itemVal}
                                rows={1}
                                disabled={!isEnabledEditing}
                                onChange={(e) => handleUpdateStaticMappingValue(e, nerName, index, itemKey)}
                            />
                        </Form.Group>
                        </Col>
                    </div>
            ))}
            <Button variant="primary" onClick={() => handleAddStaticMappingItem(nerName)} 
                hidden={!isEnabledEditing} >
                +
            </Button>
        </div>) : (<p >
            {typeof transformItem[transformItemLambdaNames[index]]}
        </p>)}
        
    </div>
    ))}
    <Button variant="primary" onClick={handleAddStaticMappingItem} hidden={!isEnabledEditing}>
        +
      </Button>
    </div>
  );
};

export default ConfigHandlerTransformRuleComponent;

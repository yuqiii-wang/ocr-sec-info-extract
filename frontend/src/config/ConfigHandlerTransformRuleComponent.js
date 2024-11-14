import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton, Col } from 'react-bootstrap';
import "./css/Config.css";

const ConfigHandlerTransformRuleComponent = ({transformItems, setTransformItems, isEnabledEditing}) => {
  const [nerNames, setNerNames] = useState([]);
  const [transformItemLambdaNames, setTransformItemLambdaNames] = useState([]);
  const [transformItemLambdaNameValues, setTransformItemLambdaNameValues] = useState([]);
  const [transformItemLambdaValues, setTransformItemLambdaValues] = useState([]);
  const [colTextSizes, setTextColSizes] = useState([]);

  const handleAddItem = () => {
    // Add functionality for the "+" button (e.g., adding a new row, or other logic)
    console.log("Add Item clicked");
  };

  useEffect(() => {
    if (Object.keys(transformItems).length === 0) {
        return;
    }
    const colTextSizeTempList = [];
    const tmpNerNames = [];
    const tmpTransformItemLambdaNames = [];
    const tmpTransformItemLambdaValues = [];
    Object.entries(transformItems).map(([transformItemName, transformItemLambdas]) => {
        if (transformItemName.length < 5) {
            colTextSizeTempList.push(2);
        } else if (transformItemName.length < 10) {
            colTextSizeTempList.push(3);
        } else {
            colTextSizeTempList.push(4);
        }
        Object.entries(transformItemLambdas).map(([transformItemLambdaName, transformItemLambdaValue]) => {
            tmpTransformItemLambdaNames.push(transformItemLambdaName);
            tmpTransformItemLambdaValues.push(transformItemLambdaValue);
        });
        tmpNerNames.push(transformItemName);
    })
    setNerNames([...tmpNerNames]);
    setTransformItemLambdaNames([...tmpTransformItemLambdaNames]);
    setTransformItemLambdaValues([...tmpTransformItemLambdaValues]);
    setTextColSizes(colTextSizeTempList);
    
    }, [transformItems]);

    const handleUpdateNerName = (e, index) => {
        const updatedListItems = nerNames;
        updatedListItems[index] = e.target.value;
        setNerNames([...updatedListItems]);
    }

    const handleUpdateTransformItemLambdaName = (eKey, index) => {
        const updatedListItems = transformItemLambdaNames;
        updatedListItems[index] = eKey;
        setTransformItemLambdaNames([...updatedListItems]);

        let transformItem = transformItems[nerNames[index]];
        console.log(transformItem);

        const updatedList2Items = transformItemLambdaValues;
        if (transformItem[eKey] === undefined) {
            let tmpTransformItem = {};
            if (eKey === "datetime") {
                tmpTransformItem["datetime"] = "";
            } else if (eKey === "static_mapping") {
                tmpTransformItem["static_mapping"] = {"": ""};
            }
            updatedList2Items[index] = tmpTransformItem[eKey];
        }
        setTransformItemLambdaValues([...updatedList2Items]);
    }

    const handleUpdateStaticMappingKey = (e, index, staticMappingIndex) => {
        const updatedListItems = transformItemLambdaValues;
        const staticMappingKey = e.target.value;
        setTransformItemLambdaValues([...updatedListItems]);
    }

    const handleUpdateStaticMappingValue = (e, index, staticMappingIndex) => {
        const updatedListItems = transformItemLambdaValues;
        updatedListItems[index] = e.target.value;;
        setTransformItemLambdaValues([...updatedListItems]);
    }

  return (
    <div>
    {Object.entries(transformItems).map(([nerName, transformItem], index) => (
    <div className="transform-rule-wrapper" key={nerName}>
        <Col md={4}>
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

        <Col md={3}>
        <Form.Group>
          <DropdownButton 
            id="dropdown-basic-button"
            title={transformItemLambdaNames[index]}
            onSelect={(eKey) => handleUpdateTransformItemLambdaName(eKey, index)}
            disabled={!isEnabledEditing}
          >
            <Dropdown.Item eventKey="datetime">datetime</Dropdown.Item>
            <Dropdown.Item eventKey="static_mapping">static_mapping</Dropdown.Item>
          </DropdownButton>
        </Form.Group>
        </Col>

        { (typeof transformItemLambdaValues[index] === "string") ? (
            <div>
            <div className='transform-rule-key-val-wrapper'>
            <Col md={12}>
            <Form.Group  key={index}>
                <Form.Control
                as="textarea"
                value={transformItemLambdaValues[index]}
                rows={1}
                disabled={!isEnabledEditing}
                />
          </Form.Group>
          </Col>
          </div>
          </div>
        ) : (transformItemLambdaValues[index] instanceof Object) ? (
        <div>
            {Object.entries(transformItemLambdaValues[index]).map(([key, val], staticMappingIndex) => (
                    <div className='transform-rule-key-val-wrapper'>
                        <Col md={5}>
                        <Form.Group  key={staticMappingIndex}>
                            <Form.Control  key={staticMappingIndex}
                            as="textarea"
                            value={key}
                            rows={1}
                            disabled={!isEnabledEditing}
                            onChange={(e) => handleUpdateStaticMappingKey(e, index, staticMappingIndex)}
                        />
                        </Form.Group>
                        </Col>
                        as
                        <Col md={5}>
                        <Form.Group  key={key}>
                            <Form.Control  key={key}
                                as="textarea"
                                value={val}
                                rows={1}
                                disabled={!isEnabledEditing}
                                onChange={(e) => handleUpdateStaticMappingValue(e, index, staticMappingIndex)}
                            />
                        </Form.Group>
                        </Col>
                    </div>
            ))}
            <Button variant="primary" onClick={handleAddItem} hidden={!isEnabledEditing}>
                +
            </Button>
        </div>) : (<p>
            {typeof transformItemLambdaValues[index]}
        </p>)}
        
    </div>
    ))}
    <Button variant="primary" onClick={handleAddItem} hidden={!isEnabledEditing}>
        +
      </Button>
    </div>
  );
};

export default ConfigHandlerTransformRuleComponent;

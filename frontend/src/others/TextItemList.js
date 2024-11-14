import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import "./css/TextItemList.css"

const TextItemList = ({listName, listItems, setListItems, isEnabledEditing}) => {

  const [isOnEditing, setIsOnEditing] = useState(false);
  const [isOnEditingItemIdx, setIsOnEditingItemIdx] = useState(-1);
  const [colTextSizes, setTextColSizes] = useState([]);
  const [newText, setNewText] = useState('');

  const toggleIsEditing = () => {
    isOnEditing ? setIsOnEditing(false) : setIsOnEditing(true);
  }

  const handleClickAddItem = () => {
    if (!isOnEditing) { // is '+'
        setIsOnEditingItemIdx(listItems.length);
    } else { // is 'Save'
        if (newText !== "") {
            setListItems([...listItems, newText]);
        }
    }
    toggleIsEditing();
    setNewText("");
  }

  const handleAddNewText = (e) => {
    setNewText(e.target.value)
  };

  const handleUpdateText = (e, index) => {
    const updatedListItems = listItems;
    updatedListItems[index] = e.target.value;
    setListItems([...updatedListItems]);
  }

  useEffect(() => {
    const colTextSizeTempList = [];
    for (let listItem of listItems) {
        if (listItem.length < 5) {
            colTextSizeTempList.push(2);
        } else if (listItem.length < 10) {
            colTextSizeTempList.push(3);
        } else {
            colTextSizeTempList.push(4);
        }
    }
    setTextColSizes(colTextSizeTempList);
    }, [listItems]);

  return (
      <Row>
        <div className='flex-container'>
        <h6>{listName}:</h6>
        {listItems.map((item, index) => (
          <Col key={item} md={colTextSizes[index]}>
            <div className='text-item' key={item}>
                <Form.Control key={item}
                as="textarea"
                rows={1}
                disabled={!isEnabledEditing}
                value={item}
                onChange={(e) => {handleUpdateText(e, index);}}
            />
              </div>
          </Col>
        ))}
        <Col md={3} hidden={!isOnEditing}>
        <div className='text-item' >
            <input
                type="text"
                value={newText}
                onChange={handleAddNewText}
                className="form-control mr-2"
              />
              </div>
        </Col>
        <Col>
        <div className='add-btn'>
            <Button
              variant="primary"
              hidden={!isEnabledEditing}
              onClick={() => {handleClickAddItem();}}
            >
              {isOnEditing ? 'Save' : '+'}
            </Button>
            </div>
        </Col>
        </div>
      </Row>
  );
};

export default TextItemList;
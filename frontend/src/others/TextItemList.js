import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import "./css/TextItemList.css"

const TextItemList = ({listName, listItems, setListItems}) => {

  const [isOnEditing, setIsOnEditing] = useState(false);
  const [isOnEditingItemIdx, setIsOnEditingItemIdx] = useState(-1);
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

  return (
      <Row>
        <div className='flex-container'>
        <h6>{listName}:</h6>
        {listItems.map((item, index) => (
          <Col key={index} md={3}>
            <div className='text-item' >
              {item}
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
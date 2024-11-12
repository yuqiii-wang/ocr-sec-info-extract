import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import "./css/TextItemList.css"

const TextItemList = ({listName, listItems, setListItems}) => {

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

  useEffect(() => {
    const colTextSizeTempList = [];
    for (let listItem of listItems) {
        if (listItem.length > 10) {
            colTextSizeTempList.push(4);
        } else {
            colTextSizeTempList.push(3);
        }
    }
    setTextColSizes(colTextSizeTempList);
    }, [listItems]);

  return (
      <Row>
        <div className='flex-container'>
        <h6>{listName}:</h6>
        {listItems.map((item, index) => (
          <Col key={index} md={colTextSizes[index]}>
            <div className='text-item' >
                <Form.Control
                as="textarea"
                rows={1}
                readOnly
                value={item}
                onFocus={(e) => {return;}}
                style={{
                    resize: 'none', // Disable resizing
                    overflowY: 'hidden', // Disable vertical scroll
                    cursor: 'default', // No pointer cursor
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    border: '1px solid #ced4da',
                  }} 
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
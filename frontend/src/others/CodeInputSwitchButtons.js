import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/CodeInputSwitchButtons.css'; // Import your custom CSS file
import { GlobalAppContext } from '../GlobalAppContext';

const TriangleLeftButton = () => {
    const { isOnInputShow, setIsOnInputShow } = useContext(GlobalAppContext);

  return (
    <div className="triangle-btn-container">
      <Button className="triangle-btn triangle-left"
      onClick={() => setIsOnInputShow(true)}
      />
    </div>
  );
};

const TriangleRightButton = () => {
    const { isOnInputShow, setIsOnInputShow } = useContext(GlobalAppContext);

    return (
    <div className="triangle-btn-container">
        <Button className="triangle-btn triangle-right"
        onClick={() => setIsOnInputShow(false)}/>
    </div>
    );
  };

export {TriangleLeftButton, TriangleRightButton};

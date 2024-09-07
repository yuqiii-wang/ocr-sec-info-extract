import React, { useState, useContext, useEffect } from 'react';
import { GlobalAppContext } from "../GlobalAppContext";
import './css/ComponentSepLine.css';

const ComponentSepLine = () => {
    const { setReferenceCodeSepOffset } = useContext(GlobalAppContext);

  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(3);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const diffY = e.clientY - startY;
      const newHeightRem = Math.max(0, startHeight - diffY / 16); // 16px per rem
      setReferenceCodeSepOffset(newHeightRem);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
      <div
        className="resizable-reference-code-line"
        onMouseDown={handleMouseDown}
      />
  );
};

export default ComponentSepLine;

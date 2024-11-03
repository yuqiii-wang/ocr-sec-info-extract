import React, { useContext } from 'react';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { GlobalAppContext } from "../GlobalAppContext";


const CloseToRestartButton = () => {
    const { isJustStart
    } = useContext(GlobalAppContext);

    const handleRefresh = () => {
        window.location.reload();
    };

  return (
    <div hidden={isJustStart}>
        <OverlayTrigger placement="top" overlay={
            <Tooltip id="button-tooltip">
                Close all to start anew
            </Tooltip>
        } >
        <span style={{ fontWeight: 'bold', color: 'black',
                        transform: 'scale(2)'
        }} 
        onMouseEnter={(e) => {
            e.currentTarget.style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.cursor = 'default';
          }}
        onClick={handleRefresh}>
            &times;
        </span>
        </OverlayTrigger>
    </div>
  );
};

export default CloseToRestartButton;

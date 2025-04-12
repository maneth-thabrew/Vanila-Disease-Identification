import React, { useState, useEffect } from "react";
import { AiOutlineNotification, AiFillMessage } from 'react-icons/ai'
import './info.css';

function InfoSingle({title, messages}) {
  useEffect(() => {
  }, [])

  return (
    <div className="topCard">
      <div className="topCard_name">
          <h2>{title||"Notification"}</h2>
      </div>
      <div className="earning">
        {messages&&messages.length>0&&messages.map((message) =><div className="ct-point">
            {message}
        </div>)}
      </div>
    </div>
  );
}

const Icon = ({ icon }) => (
  <li 
  // style={{backgroundColor: '#f011d2', borderRadius: '10px'}}
  >
    <a href="#">{icon}</a>
  </li>
);

export default InfoSingle;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FilterGroupAnime({ links, onAnime, inProp, setInProp }) {
  const navigate = useNavigate()
  const [activatedButton, setActivatedButton] = useState('');

  // Function to handle button click and set the activated button
  const handleButtonClick = (button) => {
    // Toggle the value of inProp
    // setInProp(!inProp);
    setActivatedButton(button.name);
    navigate(button.to)
  };

  return (
    <div className="filter_buttons">
      {links.map((link) => (
        <button
          key={link.name}
          to={link.to}
          className={activatedButton === link.name ? 'button' : 'button2'}
          onClick={() => {setInProp(!inProp); handleButtonClick(link)}}
        >
          {link.name}
        </button>
      ))}
    </div>
  );
}

export default FilterGroupAnime;

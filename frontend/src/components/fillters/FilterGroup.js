import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FilterGroup({ links }) {
  // Initialize state to track the activated button
  const [activatedButton, setActivatedButton] = useState('');

  // Function to handle button click and set the activated button
  const handleButtonClick = (buttonName) => {
    setActivatedButton(buttonName);
  };

  return (
    <div className="filter_buttons">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={activatedButton === link.name ? 'button' : 'button2'}
            onClick={() => handleButtonClick(link.name)}
          >
            {link.name}
          </Link>
        ))}
    </div>
  );
}

export default FilterGroup;
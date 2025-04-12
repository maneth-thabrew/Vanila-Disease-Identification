import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserEdit, FaChartLine, FaSearchPlus, FaBug, FaAdjust } from 'react-icons/fa';
import './items.css';
import { BiHome } from 'react-icons/bi';
import { vars } from '../../environment/variables'

const IconGrid = () => {
  const icons = [
    { icon: <BiHome />, link: '/', text: 'Home' },
    { icon: <FaUserEdit />, link: '/users', text: 'Users Management', admin: true },
    { icon: <FaSearchPlus />, link: '/quality', text: 'Quality Inspection', admin: false },
    { icon: <FaBug />, link: '/diseases', text: 'Disease Inspection', admin: false },
    // { icon: <FaChartLine />, link: '/stats', text: 'Statistics', admin: false },
    // { icon: <FaAdjust />, link: '/iot', text: 'IoT Panel', admin: false },
  ];

  return (
    <div className="icon-grid">
      {icons.map((item, index) => {
        if(item.admin&&item.admin===true&&(localStorage.getItem("role")==="User"||localStorage.getItem("role")==="Farmer")) return;
        return (
        <div className="grid-cell" key={index}>
          <Link to={item.link} className="icon-button">
            {item.icon}
            <span className="icon-text">{item.text}</span>
          </Link>
        </div>
      )}
      )}
      
    </div>
  );
};

export default IconGrid;
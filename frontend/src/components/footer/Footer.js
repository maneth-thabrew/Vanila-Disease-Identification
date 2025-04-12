import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Vanila Quality Inspection Site</p>
      </div>
    </footer>
  );
};

export default Footer;
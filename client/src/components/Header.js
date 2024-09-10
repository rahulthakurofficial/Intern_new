// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Header.css'; // Optional: For styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>MyApp</h1>
      </div>
      <nav>
        <ul className="nav-links">
         
          <li><Link to="/Login">Login</Link></li>
          <li><Link to="/Signup">Signup</Link></li>
       
        </ul>
      </nav>
    </header>
  );
};

export default Header;

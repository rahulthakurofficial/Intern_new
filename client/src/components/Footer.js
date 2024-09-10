// src/components/Footer.js
import React from 'react';
import '../style/Footer.css'; // Optional: For styling

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
      <p>Contact us: <a href="mailto:support@myapp.com">support@myapp.com</a></p>
    </footer>
  );
};

export default Footer;


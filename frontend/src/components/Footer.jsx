import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-500 py-6 text-center border-t">
      <p>Cartify &copy; {currentYear}. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;

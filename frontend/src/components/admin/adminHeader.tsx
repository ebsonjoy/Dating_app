import React from 'react';

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="bg-gray-800 text-white py-2 px-8">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
};

export default Header;

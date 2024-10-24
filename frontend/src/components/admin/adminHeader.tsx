import React from 'react';
//tailwind

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="bg-gray-800 text-white py-2 px-4 sm:px-6 md:px-8 lg:px-10">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">{title}</h1>
    </header>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Monopoly DApp</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-400 transition">Accueil</Link>
          </li>
          <li>
            <Link to="/properties" className="hover:text-gray-400 transition">Biens Disponibles</Link>
          </li>
          <li>
            <Link to="/my-properties" className="hover:text-gray-400 transition">Mes Biens</Link>
          </li>
          <li>
            <Link to="/exchange" className="hover:text-gray-400 transition">Échange</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

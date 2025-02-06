import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/css/Navbar.css"
import WalletConnect from './WalletConnect';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="title">Monopoly DApp</h1>
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Accueil</Link></li>
          <li><Link to="/properties" className="nav-link">Biens Disponibles</Link></li>
          <li><Link to="/my-properties" className="nav-link">Mes Biens</Link></li>
          <li><Link to="/exchange" className="nav-link">Échange</Link></li>
          <WalletConnect />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

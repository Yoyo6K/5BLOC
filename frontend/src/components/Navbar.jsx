import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../assets/css/Navbar.css";
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="title">Monopoly DApp</h1>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
          <li><Link to="/properties" className="nav-link" onClick={() => setMenuOpen(false)}>Biens Disponibles</Link></li>
          <li><Link to="/my-properties" className="nav-link" onClick={() => setMenuOpen(false)}>Mes Biens</Link></li>
          <li><Link to="/exchange" className="nav-link" onClick={() => setMenuOpen(false)}>Échange</Link></li>
          <WalletConnect />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

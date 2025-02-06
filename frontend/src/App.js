import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import MyProperties from './pages/MyProperties';
import Exchange from './pages/Exchange';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/exchange" element={<Exchange />} />
      </Routes>
    </div>
  );
}

export default App;
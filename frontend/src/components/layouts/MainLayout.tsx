import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SideMenu } from '../SideMenu';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app-container">
      <SideMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main-content">
        <button className="hamburger-menu" onClick={toggleMenu}>
          &#9776;
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
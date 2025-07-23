import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './SideMenu.css';
import { useAuth } from '../context/AuthContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose(); // メニューを閉じる
  };

  const handleLinkClick = () => {
    onClose(); // リンククリック時にメニューを閉じる
  };

  return (
    <>
      <div className={`overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose}></div>
      <aside className={`side-menu ${isOpen ? 'is-open' : ''}`}>
        <nav>
          <ul>
            <li>
              <NavLink to="/" end onClick={handleLinkClick}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" onClick={handleLinkClick}>
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink to="/words" onClick={handleLinkClick}>
                Words
              </NavLink>
            </li>
            <li>
              <NavLink to="/account" onClick={handleLinkClick}>
                Account
              </NavLink>
            </li>
            <li>
              <NavLink to="/login-history" onClick={handleLinkClick}>
                Login History
              </NavLink>
            </li>
          </ul>
          {isAuthenticated && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </aside>
    </>
  );
};
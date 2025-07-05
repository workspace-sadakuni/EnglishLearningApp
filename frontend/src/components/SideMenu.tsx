import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './SideMenu.css';
import { useAuth } from '../context/AuthContext';

export const SideMenu: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <aside className="side-menu">
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories">
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/words">
              Words
            </NavLink>
          </li>
        </ul>
        {isAuthenticated && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </aside>
  );
};
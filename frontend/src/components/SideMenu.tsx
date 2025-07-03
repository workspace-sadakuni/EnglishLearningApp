import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideMenu.css';

export const SideMenu: React.FC = () => {
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
      </nav>
    </aside>
  );
};
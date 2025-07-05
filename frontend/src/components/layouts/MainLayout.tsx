import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideMenu } from '../SideMenu';

export const MainLayout: React.FC = () => {
  return (
    <div className="app-container">
      <SideMenu />
      <main className="main-content">
        {/* ここにネストされたルートのコンポーネントが描画される */}
        <Outlet />
      </main>
    </div>
  );
};
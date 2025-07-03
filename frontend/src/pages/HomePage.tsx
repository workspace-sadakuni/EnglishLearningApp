import React from 'react';
import { HomeCategoryList } from '../components/HomeCategoryList';

export const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to your English Learning App!</p>
      <hr />
      <HomeCategoryList />
    </div>
  );
};
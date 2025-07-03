import React, { useState } from 'react';
import { CategoryForm } from '../components/CategoryForm';
import { CategoryList } from '../components/CategoryList';

export const CategoryPage: React.FC = () => {
  const [listKey, setListKey] = useState(0);

  const handleCategoryCreated = () => {
    setListKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <h1>Category Management</h1>
      <div className="card">
        <CategoryForm onCategoryCreated={handleCategoryCreated} />
      </div>
      <hr />
      <div className="card">
        <CategoryList keyForRemount={listKey} />
      </div>
    </div>
  );
};
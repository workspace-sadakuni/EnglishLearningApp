import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types/Category';
import { getAllCategories } from '../api/categoryApi';

export const HomeCategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div>
      <h2>Select a Category to Start</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <Link to={`/quiz/${category.id}`} key={category.id} className="category-card">
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import type { Category } from '../types/Category';
import { getAllCategories, deleteCategory } from '../api/categoryApi';
import { CategoryEditModal } from './CategoryEditModal'; 

// Propsの型を定義
interface CategoryListProps {
    keyForRemount: number; // このキーが変わるとコンポーネントが再マウントされる
  }

export const CategoryList: React.FC<CategoryListProps> = ({ keyForRemount }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // モーダルの状態管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [keyForRemount]); // 空の依存配列は、コンポーネントのマウント時に一度だけ実行されることを意味する。

  // 編集ボタンがクリックされたときの処理
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // モーダルが閉じるリクエストがあったときの処理
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };
  
  // カテゴリーが更新されたときの処理
  const handleCategoryUpdated = () => {
    // 一覧を再取得
    fetchCategories();
  }

  // 削除ボタンがクリックされたときの処理を追加
  const handleDeleteClick = async (category: Category) => {
    // ブラウザの標準的な確認ダイアログを表示
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(category.id);
        // 成功したら一覧を再取得して画面を更新
        fetchCategories(); 
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Failed to delete category.');
      }
    }
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Category List</h2>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="category-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={2}>No categories found.</td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <div className="action-buttons"> {/* ボタンをグループ化 */}
                    <button onClick={() => handleEditClick(category)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteClick(category)} className="delete-btn">Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      )}
      
      <CategoryEditModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        category={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />
    </div>
  );
};
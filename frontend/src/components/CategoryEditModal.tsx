import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import type { Category } from '../types/Category';
import { updateCategory } from '../api/categoryApi';

// モーダルのスタイル（中央に表示するための基本的なスタイル）
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
  },
};

// react-modalをアプリケーションにバインド（必須）
// App.tsxで設定しても良いが、ここで一度だけ実行すればOK
Modal.setAppElement('#root');

interface CategoryEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  category: Category | null;
  onCategoryUpdated: () => void;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  isOpen,
  onRequestClose,
  category,
  onCategoryUpdated,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // モーダルが開かれ、カテゴリー情報が渡されたら、フォームの初期値を設定
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    try {
      await updateCategory(category.id, name);
      onCategoryUpdated(); // 親に更新を通知
      onRequestClose(); // モーダルを閉じる
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Edit Category"
    >
      <h2>Edit Category</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '95%', marginBottom: '10px' }}
        />
        <button type="submit">Update</button>
        <button type="button" onClick={onRequestClose} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};
import React, { useState } from 'react';
import { createCategory } from '../api/categoryApi';
import { isAxiosError } from 'axios'; // catch構文引数にany型はNGなため、型指定せず（unknow）isAxiosError判定処理を追加するため。

// Propsの型を定義
interface CategoryFormProps {
  onCategoryCreated: () => void; // カテゴリ作成成功時に呼び出すコールバック関数
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onCategoryCreated }: CategoryFormProps) => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const newCategory = await createCategory(name);
      setMessage(`Category "${newCategory.name}" has been created successfully!`);
      setName(''); // 入力欄をクリア
      onCategoryCreated();
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';

      // Axiosのエラーかどうかを判定
      if (isAxiosError(err)) {
        // バックエンドから返されたエラーレスポンスの 'message' プロパティを取得
        // 存在しない場合は、一般的なエラーメッセージを使う
        errorMessage = err.response?.data?.message || err.message;
      }
      
      // // Axiosのエラーかどうかを判定
      // if (isAxiosError(err)) {
      //   // バックエンドから返されたエラーメッセージを取得（存在すれば）
      //   errorMessage = err.response?.data?.message || err.message;
      // } else if (err instanceof Error) {
      //   // Axios以外の一般的なエラーの場合
      //   errorMessage = err.message;
      // }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Category</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
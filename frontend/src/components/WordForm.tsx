import React, { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import type { Category } from '../types/Category';
import { getAllCategories } from '../api/categoryApi';
import { createWord } from '../api/wordApi';

interface WordFormProps {
  onWordCreated: () => void;
}

export const WordForm: React.FC<WordFormProps> = ({ onWordCreated }) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // コンポーネントマウント時にカテゴリー一覧を取得
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAudioFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setWord('');
    setMeaning('');
    setCategoryId('');
    setImageFile(null);
    setAudioFile(null);
    // input[type=file]の値をリセット
    const imageInput = document.getElementById('image-input') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
    const audioInput = document.getElementById('audio-input') as HTMLInputElement;
    if (audioInput) audioInput.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !meaning || !categoryId) {
      setError('Word, Meaning, and Category are required.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await createWord({
        word,
        meaning,
        categoryId,
        image: imageFile || undefined,
        audio: audioFile || undefined,
      });
      setMessage('Word created successfully!');
      resetForm();
      // 親コンポーネントに通知(word作成後に一覧情報を更新するため)
      onWordCreated();
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to create word.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Word</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="margin-top-10"><label>Word: <input type="text" value={word} onChange={e => setWord(e.target.value)} /></label></div>
        <div className="margin-top-10"><label>Meaning: <input type="text" value={meaning} onChange={e => setMeaning(e.target.value)} /></label></div>
        <div className="margin-top-10">
          <label>Category: 
            <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="margin-top-10"><label>Image: <input type="file" id="image-input" accept="image/*" onChange={handleImageChange} /></label></div>
        <div className="margin-top-10"><label>Audio: <input type="file" id="audio-input" accept="audio/*" onChange={handleAudioChange} /></label></div>
        <div className="margin-top-10">
          <button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Word'}</button>
        </div>
      </form>
    </div>
  );
};
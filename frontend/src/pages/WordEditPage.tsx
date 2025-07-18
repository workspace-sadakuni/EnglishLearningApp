import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import type { Category } from '../types/Category';
import { getAllCategories } from '../api/categoryApi';
import { getFileAsBlob } from '../api/fileApi';
import { getWordById, updateWord, deleteWord } from '../api/wordApi';

export const WordEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // 編集後に一覧に戻るために使用

  // Form states
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // 表示用のBlob URLを保持するstate
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [existingAudioUrl, setExistingAudioUrl] = useState<string | null>(null);

  // Data states for displaying existing data
  const [categories, setCategories] = useState<Category[]>([]);
  
  // UI states
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 初期ロード中はtrue

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [catData, wordData] = await Promise.all([
          getAllCategories(),
          getWordById(Number(id)),
        ]);
        
        setCategories(catData);
        setWord(wordData.word);
        setMeaning(wordData.meaning);
        setCategoryId(wordData.categoryId);

        // ファイルパスからBlob URLを生成
        if (wordData.imagePath) {
          const blob = await getFileAsBlob(wordData.imagePath);
          setExistingImageUrl(URL.createObjectURL(blob));
        }
        if (wordData.audioPath) {
          const blob = await getFileAsBlob(wordData.audioPath);
          setExistingAudioUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // クリーンアップ関数: コンポーネントがアンマウントされるときにBlob URLを解放
    return () => {
      if (existingImageUrl) URL.revokeObjectURL(existingImageUrl);
      if (existingAudioUrl) URL.revokeObjectURL(existingAudioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !word || !meaning || !categoryId) {
      setError('Word, Meaning, and Category are required.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await updateWord({
        id: Number(id),
        word,
        meaning,
        categoryId,
        image: imageFile || undefined,
        audio: audioFile || undefined,
      });
      setMessage('Word updated successfully! Redirecting to home...');
      // 1.5秒後にホームページにリダイレクト
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to update word.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    // ユーザーに最終確認
    if (window.confirm(`Are you sure you want to delete the word "${word}"? This action cannot be undone.`)) {
      setIsLoading(true);
      setError('');
      setMessage('');
      try {
        await deleteWord(Number(id));
        setMessage('Word deleted successfully. Redirecting to home...');
        // 1.5秒後にホームページにリダイレクト
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to delete word.');
        } else {
          setError('An unexpected error occurred.');
        }
        setIsLoading(false);
      }
      // finallyブロックは不要。成功時はリダイレクトするため
    }
  };
  
  if (isLoading) {
    return <p>Loading word data...</p>;
  }

  return (
    <div>
      <Link to="/">← Back to Home</Link>
      <h2>Edit Word: {word}</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="word-input">Word: </label>
          <input id="word-input" type="text" value={word} onChange={e => setWord(e.target.value)} required />
        </div>
        
        <div>
          <label htmlFor="meaning-input">Meaning: </label>
          <input id="meaning-input" type="text" value={meaning} onChange={e => setMeaning(e.target.value)} required />
        </div>
        
        <div>
          <label htmlFor="category-select">Category: </label>
          <select id="category-select" value={categoryId} onChange={e => setCategoryId(Number(e.target.value))} required>
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <hr/>

        <div>
          <label>Current Image: </label>
          {existingImageUrl ? <img src={existingImageUrl} alt="current" style={{ maxWidth: '100px', verticalAlign: 'middle' }}/> : "None"}
        </div>
        <div>
          <label htmlFor="image-replace">Replace Image: </label>
          <input id="image-replace" type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
        </div>
        
        <hr/>
        
        <div>
          <label>Current Audio: </label>
          {existingAudioUrl ? <audio controls src={existingAudioUrl} /> : "None"}
        </div>
        <div>
          <label htmlFor="audio-replace">Replace Audio: </label>
          <input id="audio-replace" type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files ? e.target.files[0] : null)} />
        </div>
        
        <hr/>

        <button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Word'}</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      {/* 削除セクション */}
      <div>
        <h3>Danger Zone</h3>
        <p>Once you delete a word, there is no going back. Please be certain.</p>
        <button 
          onClick={handleDelete} 
          disabled={isLoading}
          style={{ backgroundColor: '#f44336', color: 'white' }}
        >
          {isLoading ? 'Deleting...' : 'Delete This Word'}
        </button>
      </div>
    </div>
  );
};
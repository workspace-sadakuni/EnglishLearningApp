import React, { useState, useEffect } from 'react';
import { isAxiosError } from 'axios';
import { getMyProfile, updateMyProfile } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

export const AccountPage: React.FC = () => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    // ページ読み込み時に現在のプロフィール情報を取得
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setCurrentUsername(profile.username);
        setUsername(profile.username); // フォームの初期値として設定
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setError('Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username && !password) {
      setError('Please enter a new username or password.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await updateMyProfile({ 
        username: username !== currentUsername ? username : undefined,
        password: password || undefined,
      });

      // レスポンスに新しいトークンが含まれていれば、AuthContextを更新
      if (response.token) {
        login(response.token);
      }

      setMessage('Account updated successfully!');
      setCurrentUsername(response.user.username); // 表示名を更新
      setPassword(''); // パスワード入力欄はクリア
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to update account.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>My Account</h1>
      <div className="card">
        <h2>Edit Profile</h2>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '400px' }}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Updating...' : 'Update Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
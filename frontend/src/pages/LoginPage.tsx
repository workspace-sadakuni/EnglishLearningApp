import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/userApi';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContextからlogin関数を取得

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // ログインAPIを呼び出し
      const response = await loginUser({ username, password });
      
      // 成功したら、AuthContextのlogin関数を実行してトークンを保存
      login(response.token);
      
      // ホームページにリダイレクト
      navigate('/');
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
            setError('Invalid username or password.');
        } else {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};
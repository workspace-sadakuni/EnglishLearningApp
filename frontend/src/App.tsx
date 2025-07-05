import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layouts
import { MainLayout } from './components/layouts/MainLayout';
import { ProtectedRoute } from './components/layouts/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { WordPage } from './pages/WordPage';
import { WordEditPage } from './pages/WordEditPage';
import { QuizPage } from './pages/QuizPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* === 認証が不要なルート === */}
        {/* これらのページはサイドメニューなしで表示される */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* === 認証が必要なルート (ここが重要) === */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/words" element={<WordPage />} />
            <Route path="/words/:id/edit" element={<WordEditPage />} />
            <Route path="/quiz/:categoryId" element={<QuizPage />} />
          </Route>
        </Route>

        {/* 404 Not Found ページなどもここに追加できる */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
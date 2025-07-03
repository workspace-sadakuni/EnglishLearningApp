import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { SideMenu } from './components/SideMenu';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { WordPage } from './pages/WordPage';
// import { WordDetailPage } from './pages/WordDetailPage';
import { WordEditPage } from './pages/WordEditPage';
import { QuizPage } from './pages/QuizPage'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <SideMenu />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/words" element={<WordPage />} />
            <Route path="/words/:id/edit" element={<WordEditPage />} />
            <Route path="/quiz/:categoryId" element={<QuizPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
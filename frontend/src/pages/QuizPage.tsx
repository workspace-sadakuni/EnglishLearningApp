import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Word } from '../types/Word';
import { getWordsByCategoryId } from '../api/wordApi';

export const QuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    if (categoryId) {
      const fetchWords = async () => {
        setLoading(true); // 新しいクイズを始める前にローディング状態にする
        try {
          const data = await getWordsByCategoryId(Number(categoryId));
          setWords(data);
          setShowMeaning(false); // 新しいクイズが始まったら意味を隠す
          setCurrentIndex(0);    // インデックスをリセット
        } catch (error) {
          console.error('Failed to fetch words for quiz', error);
        } finally {
          setLoading(false);
        }
      };
      fetchWords();
    }
  }, [categoryId]);

  const getFileUrl = (path: string | null): string | undefined => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    return path && apiBaseUrl ? `${apiBaseUrl}/files/${path}` : undefined;
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // 次の単語に進むときは、意味を再び非表示にする
      setShowMeaning(false);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (words.length === 0) {
    return (
      <div>
        <p>No words found in this category.</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const isLastWord = currentIndex === words.length - 1;
  const imageUrl = getFileUrl(currentWord.imagePath);
  const audioUrl = getFileUrl(currentWord.audioPath);

  return (
    <div className="quiz-container">
      <h1>{currentWord.word}</h1>
      {/* <p><strong>Meaning:</strong> {currentWord.meaning}</p> */}
      <div className="meaning-area">
        {showMeaning ? (
          <p className="meaning-text"><strong>Meaning:</strong> {currentWord.meaning}</p>
        ) : (
          <button onClick={() => setShowMeaning(true)} className="show-meaning-button">
            Show Meaning
          </button>
        )}
      </div>
      
      {imageUrl && <img src={imageUrl} alt={currentWord.word} className="quiz-image" />}
      {audioUrl && <audio controls src={audioUrl} className="quiz-audio" />}
      
      <div className="quiz-navigation">
        <p>
          {currentIndex + 1} / {words.length}
        </p>
        {isLastWord ? (
          <Link to="/" className="quiz-button">
            Finish & Back to Home
          </Link>
        ) : (
          <button onClick={handleNext} className="quiz-button">
            Next →
          </button>
        )}
      </div>
    </div>
  );
};
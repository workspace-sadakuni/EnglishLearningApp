import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Word } from '../types/Word';
import { getFileAsBlob } from '../api/fileApi';
import { getWordsByCategoryId } from '../api/wordApi';

export const QuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

  // 表示中の単語が変わったら、その単語のファイルを取得するuseEffect
  useEffect(() => {
    // 古いBlob URLを解放
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setImageUrl(null);
    setAudioUrl(null);

    const currentWord = words[currentIndex];
    if (!currentWord) return;

    const fetchFiles = async () => {
      try {
        if (currentWord.imagePath) {
          const blob = await getFileAsBlob(currentWord.imagePath);
          setImageUrl(URL.createObjectURL(blob));
        }
        if (currentWord.audioPath) {
          const blob = await getFileAsBlob(currentWord.audioPath);
          setAudioUrl(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error("Failed to fetch word's media files.", error);
      }
    };
    
    fetchFiles();

    // クリーンアップ関数
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, words]);

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
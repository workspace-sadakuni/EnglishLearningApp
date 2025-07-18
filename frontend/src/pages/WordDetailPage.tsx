import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Word } from '../types/Word';
import { getFileAsBlob } from '../api/fileApi';
import { getWordById } from '../api/wordApi';

export const WordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URLからIDを取得
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // // APIのベースURLを環境変数から取得
  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // // ファイルへのフルパスを生成するヘルパー
  // const getFileUrl = (path: string | null) => {
  //   // パスが存在し、APIベースURLも定義されている場合のみURLを生成
  //   if (path && API_BASE_URL) {
  //     return `${API_BASE_URL}/files/${path}`;
  //   }
  //   return null;
  // };

  useEffect(() => {
    if (id) {
      const fetchWordAndFiles = async () => {
        try {
          const wordData = await getWordById(Number(id));
          setWord(wordData);

          // 画像ファイルのURLを生成
          if (wordData.imagePath) {
            const blob = await getFileAsBlob(wordData.imagePath);
            setImageUrl(URL.createObjectURL(blob));
          }

          // 音声ファイルのURLを生成
          if (wordData.audioPath) {
            const blob = await getFileAsBlob(wordData.audioPath);
            setAudioUrl(URL.createObjectURL(blob));
          }

        } catch (error) {
          console.error('Failed to fetch data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchWordAndFiles();
    }

    // クリーンアップ関数
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, id, imageUrl]);

  if (loading) return <p>Loading details...</p>;
  if (!word) return <p>Word not found.</p>;

  return (
    <div>
      <Link to="/">← Back to Home</Link>
      <h1>{word.word}</h1>
      <p><strong>Meaning:</strong> {word.meaning}</p>
      
      {imageUrl && (
        <div>
          <h3>Image</h3>
          <img src={imageUrl} alt={word.word} style={{ maxWidth: '300px' }} />
        </div>
      )}
      
      {audioUrl && (
        <div>
          <h3>Audio</h3>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};
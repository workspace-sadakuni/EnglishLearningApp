import React, { useState } from 'react';
import { WordForm } from '../components/WordForm';
import { WordList } from '../components/WordList';

export const WordPage: React.FC = () => {
  // WordListを再マウント（再レンダリング）させるためのキー
  const [listKey, setListKey] = useState(0);

  // WordFormから呼び出されるコールバック関数
  const handleWordCreated = () => {
    // キーの値を更新することで、WordListのuseEffectが再実行される
    setListKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <h1>Word Management</h1>
      <div className="card">
        {/* コールバック関数をPropsとして渡す */}
        <WordForm onWordCreated={handleWordCreated} />
      </div>
      <hr />
      <div className="card">
        {/* キーをPropsとして渡す */}
        <WordList keyForRemount={listKey} />
      </div>
    </div>
  );
};
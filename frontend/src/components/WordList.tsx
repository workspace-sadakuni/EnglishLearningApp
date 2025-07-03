import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Word } from '../types/Word';
import { getAllWords, type PagedResult } from '../api/wordApi';

interface WordListProps {
  keyForRemount: number;
}

export const WordList: React.FC<WordListProps> = ({ keyForRemount }) => {
  const [pagedResult, setPagedResult] = useState<PagedResult<Word>>({ 
    items: [], 
    totalPages: 0,
    // currentPageとtotalItemsも初期値に含めておくとより型が安定する
    currentPage: 1, 
    totalItems: 0 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // 検索キーワード用のstate
  const [searchTerm, setSearchTerm] = useState('');
  // デバウンスされた検索キーワード用のstate
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // input要素(検索ボックス)への参照を作成
  const searchInputRef = useRef<HTMLInputElement>(null);

  // デバウンスの実装
  useEffect(() => {
    // ユーザーの入力が終わってから500ms後にAPIを叩く
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // 新しい検索を始めたら1ページ目に戻る
    }, 500);

    // クリーンアップ関数: 次のuseEffectが実行される前 or コンポーネントがアンマウントされる前に実行
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]); // searchTermが変わるたびに実行

  // API実行用のuseEffect
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        // デバウンスされたキーワードおよびcurrentPageでAPIを呼び出す
        const data = await getAllWords(debouncedSearchTerm, currentPage);
        setPagedResult(data);
      } catch (error) {
        console.error('Failed to fetch words', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  // keyForRemountか、デバウンスされたキーワードが変わったらAPIを再実行
  }, [keyForRemount, debouncedSearchTerm, currentPage]);

  // 再レンダリング後にフォーカスを維持するためのuseEffect
  useEffect(() => {
    // searchInputRef.currentが存在し、かつアクティブな要素でない場合にフォーカスする
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      // カーソルの位置を記憶して再設定
      const cursorPos = searchInputRef.current.value.length;
      searchInputRef.current.focus();
      // フォーカスを当てるとカーソルが先頭に行ってしまうのを防ぐ
      searchInputRef.current.setSelectionRange(cursorPos, cursorPos);
    }
  }); // 依存配列を空にすると、毎回のレンダリング後に実行される

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagedResult.totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p>Loading words...</p>;

  return (
    <div>
      <h2>Word List</h2>
      
      <div className="search-form">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* ローディング表示をテーブルの中に入れると親切 */}
      <table className="word-table">
        <thead>
          <tr>
            <th>Word</th>
            <th>Meaning</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // ローディング中の表示
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                Loading...
              </td>
            </tr>
          ) : pagedResult.items.length > 0 ? (
            // データがある場合の表示
            pagedResult.items.map((word) => (
              <tr key={word.id}>
                <td>{word.word}</td>
                <td>{word.meaning}</td>
                <td>{word.categoryName || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/words/${word.id}/edit`} className="edit-btn">Edit</Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // データが0件の場合の表示
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                No words found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          « Prev
        </button>
        <span>
          Page {currentPage} of {pagedResult.totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagedResult.totalPages}>
          Next »
        </button>
      </div>
    </div>
  );
};
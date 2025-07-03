import apiClient from './apiClient';
import type { Word } from '../types/Word';

export interface CreateWordData {
  word: string;
  meaning: string;
  categoryId: number;
  image?: File;
  audio?: File;
}

export interface UpdateWordData {
  id: number;
  word: string;
  meaning: string;
  categoryId: number;
  image?: File;
  audio?: File;
}

// ページング結果の型を定義
export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export const createWord = async (data: CreateWordData): Promise<void> => {
  const formData = new FormData();
  
  formData.append('word', data.word);
  formData.append('meaning', data.meaning);
  formData.append('categoryId', String(data.categoryId));
  
  if (data.image) {
    formData.append('image', data.image);
  }
  if (data.audio) {
    formData.append('audio', data.audio);
  }

  // ファイルアップロード時はContent-Typeを'multipart/form-data'に設定
  await apiClient.post('/words', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateWord = async (data: UpdateWordData): Promise<void> => {
  const formData = new FormData();
  
  formData.append('word', data.word);
  formData.append('meaning', data.meaning);
  formData.append('categoryId', String(data.categoryId));
  
  if (data.image) {
    formData.append('image', data.image);
  }
  if (data.audio) {
    formData.append('audio', data.audio);
  }
  
  await apiClient.post(`/words/${data.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteWord = async (id: number): Promise<void> => {
  await apiClient.delete(`/words/${id}`);
};

export const getAllWords = async (searchTerm: string, page: number): Promise<PagedResult<Word>> => {
  const response = await apiClient.get<PagedResult<Word>>('/words', {
    params: {
      searchTerm: searchTerm,
      page: page,
      size: 10, // 1ページあたりの件数はここで固定
    }
  });
  return response.data;
};
  
export const getWordById = async (id: number): Promise<Word> => {
    const response = await apiClient.get<Word>(`/words/${id}`);
    return response.data;
};

export const getWordsByCategoryId = async (categoryId: number): Promise<Word[]> => {
  const response = await apiClient.get<Word[]>(`/categories/${categoryId}/words`);
  return response.data;
};
import apiClient from './apiClient';
import type { Category } from '../types/Category';

export const createCategory = async (name: string): Promise<Category> => {
  const response = await apiClient.post<Category>('/categories', { name });
  return response.data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
};

export const updateCategory = async (id: number, name: string): Promise<Category> => {
  const response = await apiClient.put<Category>(`/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
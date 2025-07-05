import apiClient from './apiClient';
import type { AuthenticationData, AuthenticationResponse, User } from '../types/User'; // User型を定義
 // User型を定義
// User型を定義
import type { UserRegistrationData } from '../types/User'; // 登録用データ型も定義
 // 登録用データ型も定義

export const registerUser = async (data: UserRegistrationData): Promise<User> => {
  const response = await apiClient.post<User>('/register', data);
  return response.data;
};

export const loginUser = async (data: AuthenticationData): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>('/login', data);
  return response.data;
};
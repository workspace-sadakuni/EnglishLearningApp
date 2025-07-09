import apiClient from './apiClient';
import type { AuthenticationData, AuthenticationResponse, UpdateProfileResponse, User } from '../types/User'; // User型を定義
 // User型を定義
// User型を定義
import type { UserRegistrationData, UserUpdateRequest } from '../types/User'; // 登録用データ型も定義
 // 登録用データ型も定義

export const registerUser = async (data: UserRegistrationData): Promise<User> => {
  const response = await apiClient.post<User>('/register', data);
  return response.data;
};

export const loginUser = async (data: AuthenticationData): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>('/login', data);
  return response.data;
};

export const getMyProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>('/me');
  return response.data;
};

export const updateMyProfile = async (data: UserUpdateRequest): Promise<UpdateProfileResponse> => {
  const response = await apiClient.put<UpdateProfileResponse>('/me', data);
  return response.data;
};

export const deleteMyAccount = async (): Promise<void> => {
  await apiClient.delete('/me');
};
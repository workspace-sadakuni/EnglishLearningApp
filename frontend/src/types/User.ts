// APIからのレスポンス用
export interface User {
    id: number;
    username: string;
    createdAt: string;
  }
  
  // APIへのリクエスト用
  export interface UserRegistrationData {
    username: string;
    password: string;
  }

  // 認証用
export interface AuthenticationData {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface UserUpdateRequest {
  username?: string;
  password?: string;
}

export interface UpdateProfileResponse {
  user: User;
  token?: string; // tokenはオプショナル
}

export interface LoginHistory {
  id: number;
  userId: number;
  username: string;
  ipAddress: string;
  userAgent: string;
  loginStatus: string;
  loginAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
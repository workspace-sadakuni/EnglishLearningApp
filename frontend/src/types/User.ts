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
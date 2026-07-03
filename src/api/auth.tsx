import axiosHelper from './axiosHelper';

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  nickname: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
}

export interface CurrentUserResponse {
  id: number;
  username: string;
  email: string;
  nickname: string;
}

export const registerAPI = (data: RegisterParams) => {
  return axiosHelper.post<any, void>('/api/auth/register', data);
};

export const loginAPI = (data: LoginParams) => {
  return axiosHelper.post<any, LoginResponse>('/api/auth/login', data);
};

export const getCurrentUserAPI = () => {
  return axiosHelper.get<any, CurrentUserResponse>('/api/auth/me');
};

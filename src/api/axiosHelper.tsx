import axios, { AxiosError } from 'axios';
import { message } from 'antd';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorMessage?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipErrorMessage?: boolean;
  }
}

interface ApiResponse<T> {
  code: number;
  message?: string;
  msg?: string;
  data: T;
}

const axiosHelper = axios.create({
  baseURL: '/',
  timeout: 5000,
});

axiosHelper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosHelper.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse<any>;
    const errorMessage = res.message || res.msg || '请求失败';
    const skipErrorMessage = response.config.skipErrorMessage;

    if (res.code === 200) {
      return res.data;
    }

    if (res.code === 401) {
      localStorage.removeItem('token');
      message.error('登录已过期，请重新登录');
      window.location.href = '/login';
      return Promise.reject(new Error(errorMessage));
    }

    // 后端返回了错误状态码（如 400 校验失败, 500 内部错误）
    if (!skipErrorMessage) {
      message.error(errorMessage);
    }
    return Promise.reject(new Error(errorMessage));
  },
  (error) => {
    // 处理 HTTP 状态码错误（如 404, 500）或网络断开
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    const skipErrorMessage = axiosError.config?.skipErrorMessage;
    const errorMessage = error.response?.data?.message || error.response?.data?.msg || '网络异常或服务器错误';
    if (!skipErrorMessage) {
      message.error(errorMessage);
    }
    return Promise.reject(error);
  },
);

export default axiosHelper;

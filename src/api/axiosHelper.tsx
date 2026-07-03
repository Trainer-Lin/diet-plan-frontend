import axios from 'axios';
import { message } from 'antd';

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

    if (res.code === 200) {
      return res.data;
    }

    if (res.code === 401) {
      localStorage.removeItem('token');
      message.error('登录已过期，请重新登录');
      window.location.href = '/login';
      return Promise.reject(new Error(errorMessage));
    }

    message.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  },
  (error) => {
    const errorMessage = error.response?.data?.message || '网络异常或服务器错误';
    message.error(errorMessage);
    return Promise.reject(error);
  },
);

export default axiosHelper;

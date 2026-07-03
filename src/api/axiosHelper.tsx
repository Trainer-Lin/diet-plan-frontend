import axios from 'axios'
import {message} from 'antd'
import { error } from 'node:console';

interface ApiResponse<T>{
    code: number;
    msg: string;
    data: T;
}

const axiosHelper = axios.create({
    baseURL:'/',
    timeout: 5000
})

axiosHelper.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('token');//从浏览器中缓存中取出token
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
)

axiosHelper.interceptors.response.use(
    (response)=>{
        const res = response.data as ApiResponse<any>;
        if(res.code === 200){
            return res.data;
        }
        if(res.code === 401){
            localStorage.removeItem('token');
            message.error('登录已过期，请重新登录');
            window.location.href = '/login';
            return Promise.reject(new Error(res.msg));
        }
        message.error("请求失败");
        return Promise.reject(new Error(res.msg));
    },(error) => {
        message.error("网络异常或服务器错误");
        return Promise.reject(error);
    }
)

export default axiosHelper;

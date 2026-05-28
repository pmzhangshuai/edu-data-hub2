import axios from 'axios';
import { message } from 'antd';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
axiosInstance.interceptors.response.use((response) => {
    const { data } = response;
    if (data.code !== 200 && data.success === false) {
        message.error(data.message || '请求失败');
        return Promise.reject(new Error(data.message));
    }
    return response;
}, (error) => {
    if (error.response) {
        const { status, data } = error.response;
        switch (status) {
            case 401:
                message.error('登录已过期，请重新登录');
                localStorage.removeItem('token');
                window.location.href = '/login';
                break;
            case 403:
                message.error('没有权限访问该资源');
                break;
            case 404:
                message.error('请求的资源不存在');
                break;
            case 500:
                message.error('服务器内部错误');
                break;
            default:
                message.error(data?.message || '请求失败，请稍后重试');
        }
    }
    else if (error.request) {
        message.error('网络连接失败，请检查网络');
    }
    else {
        message.error('请求配置错误');
    }
    return Promise.reject(error);
});
export const request = async (config) => {
    try {
        const response = await axiosInstance.request(config);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
export const get = async (url, params, config) => {
    return request({
        method: 'GET',
        url,
        params,
        ...config,
    });
};
export const post = async (url, data, config) => {
    return request({
        method: 'POST',
        url,
        data,
        ...config,
    });
};
export const put = async (url, data, config) => {
    return request({
        method: 'PUT',
        url,
        data,
        ...config,
    });
};
export const del = async (url, config) => {
    return request({
        method: 'DELETE',
        url,
        ...config,
    });
};
export default axiosInstance;

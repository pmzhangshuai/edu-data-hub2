import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import type { ApiResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    if (data.code !== 200 && data.success === false) {
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message));
    }

    return response;
  },
  (error: AxiosError<ApiResponse>) => {
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
    } else if (error.request) {
      message.error('网络连接失败，请检查网络');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export const request = async <T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const get = async <T = any>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'GET',
    url,
    params,
    ...config,
  });
};

export const post = async <T = any>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'POST',
    url,
    data,
    ...config,
  });
};

export const put = async <T = any>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'PUT',
    url,
    data,
    ...config,
  });
};

export const del = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>({
    method: 'DELETE',
    url,
    ...config,
  });
};

export default axiosInstance;

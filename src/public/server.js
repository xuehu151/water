import axios from 'axios';
import {
  Message
} from 'element-ui';

const Axios = axios.create({
  // baseURL: 'http://192.168.1.199:7001/v1',
  baseURL: 'http://121.42.253.149:37001/v1',
  // baseURL: 'http://121.42.253.149:18859/app/mock/3/v1',
  timeout: 30000,
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});
Axios.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.params = config.data;
    }
    if (sessionStorage.actk) {
      config.headers.common.actk = sessionStorage.getItem('actk');
    }

    return config;
  },
  (error) => {
    Message({
      showClose: true,
      message: error,
      type: 'error.data.error.message',
    });
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  res => {
    if (!res.data.code) {
      Message({
        showClose: true,
        message: '请求超时，请重新请求',
        type: 'error'
      });
      return Promise.reject(res.data);
    } else if (res.data.code !== 200) {
      Message({
        showClose: true,
        message: res.data.errMsg ? res.data.errMsg : res.data.message,
        type: 'error'
      });
      return Promise.reject(res.data);
    }
    return res.data;
  });
export default Axios;

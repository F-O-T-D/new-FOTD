import axios from 'axios';

const api = axios.create({
    baseURL: '100.114.50.58', // PC의 IP 주소 사용
  });
  
export default api;

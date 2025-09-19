import axios from 'axios';

const api = axios.create({
    baseURL: '172.24.97.140', // PC의 IP 주소 사용
  });
  
export default api;

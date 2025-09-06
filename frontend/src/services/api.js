import axios from 'axios';

const api = axios.create({
    baseURL: '172.30.1.3', // PC의 IP 주소 사용
  });
  
export default api;

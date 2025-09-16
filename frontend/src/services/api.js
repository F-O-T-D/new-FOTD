import axios from 'axios';

const api = axios.create({
    baseURL: '10.50.98.193', // PC의 IP 주소 사용
  });
  
export default api;

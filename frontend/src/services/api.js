import axios from 'axios';

const api = axios.create({
    baseURL: '10.50.102.63', // PC의 IP 주소 사용
  });
  
export default api;

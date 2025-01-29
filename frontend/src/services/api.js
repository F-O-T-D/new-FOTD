import axios from 'axios';

const api = axios.create({
    baseURL: 'http://172.30.1.87:3000', // PC의 IP 주소 사용
  });
  
export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: '10.14.17.64', // PC의 IP 주소 사용
  });
  
export default api;

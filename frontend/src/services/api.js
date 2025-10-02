import axios from 'axios';

const api = axios.create({
    baseURL: 'https://kiesha-semitheatric-ema.ngrok-free.dev', // PC의 IP 주소 사용
  });
  
export default api;

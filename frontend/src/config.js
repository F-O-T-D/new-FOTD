import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 🚨 개발 PC의 실제 IP 주소 (Wi-Fi IPv4 주소를 직접 입력)
const LOCAL_IP = "10.50.111.40"; // PC의 IP 주소를 수동 설정

// Expo 환경에서 실행될 때 개발 PC의 IP 자동 감지
const API_BASE_URL = Constants.manifest?.debuggerHost
    ? `http://${LOCAL_IP}:3000`
    : `http://${LOCAL_IP}:3000`;  // 기본값도 PC IP로 설정

console.log("🛠️ API_BASE_URL 설정됨:", API_BASE_URL); // 설정된 API 주소 확인

export default { API_BASE_URL };

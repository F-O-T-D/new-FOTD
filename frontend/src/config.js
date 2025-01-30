import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Expo가 실행 중인 개발 PC의 네트워크 IP를 가져옴
const DEBUGGER_HOST = Constants.manifest?.debuggerHost;

// 개발 PC의 IP 주소를 자동 감지
const API_BASE_URL = DEBUGGER_HOST
    ? `http://${DEBUGGER_HOST.split(':').shift()}:3000`
    : Platform.OS === 'ios'
        ? "http://10.50.111.40:3000"  // 개발 PC의 IP 주소 (Wi-Fi IPv4)
        : "http://10.50.111.40:3000"; // 안드로이드도 동일한 IP 사용

console.log("🛠️ API_BASE_URL 설정됨:", API_BASE_URL); // 최종 API 주소 로그 찍기

export default { API_BASE_URL };
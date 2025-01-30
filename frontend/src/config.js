//실행된 네트워크를 자동으로 감지, 현재 개발 PC의 IP로 API 주소를 설정


import Constants from 'expo-constants';

const API_BASE_URL = Constants.manifest?.debuggerHost
    ? `http://${Constants.manifest.debuggerHost.split(':').shift()}:3000`
    : "http://localhost:3000";  // 기본값

export default { API_BASE_URL };

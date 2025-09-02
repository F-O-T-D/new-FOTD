import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import { unstable_enableLogBox } from "react-native";
import App from './src/App'; // src 폴더 내 App.js 경로
import { name as appName } from './app.json'; // app.json에서 "main" 가져오기

if (typeof global.setImmediate === 'undefined') {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

console.log('App name from app.json:', appName); // 이름 확인

unstable_enableLogBox(); // React Native의 LogBox 오류 디버깅 활성화
global.__RCTProfileIsProfiling = false; // Bridgeless Mode 비활성화

// ✅ Expo 환경에서 더 안정적인 방식
registerRootComponent(App);

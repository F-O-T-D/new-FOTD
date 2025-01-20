import { AppRegistry } from 'react-native'; // React Native의 앱 등록 API
import App from './src/App'; // src 폴더 내 App.js를 진입점으로 설정
import { name as appName } from './app.json'; // app.json에서 앱 이름 가져오기

// 앱 등록
AppRegistry.registerComponent(appName, () => App);

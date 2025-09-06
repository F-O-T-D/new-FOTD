/**
 * [앱 진입점 (Entry Point)]
 * 이 파일은 우리 앱이 시작될 때 가장 먼저 실행되는 파일입니다.
 * React Native 앱은 네이티브(iOS/Android) 환경에서 시작된 후,
 * 이 파일을 통해 우리가 작성한 자바스크립트 코드를 불러옵니다.
 */

import 'react-native-gesture-handler'; //제스처 핸들러 라이브러리, 반드시 최상단에 위치
import 'react-native-reanimated'; //애니메이션을 구현하기 위한 라이브러리 임포트
import { registerRootComponent } from 'expo'; // Expo의 루트 컴포넌트 등록 함수 임포트
import App from './src/App'; // 앱의 메인 컴포넌트 임포트


// 앱 실행
registerRootComponent(App);



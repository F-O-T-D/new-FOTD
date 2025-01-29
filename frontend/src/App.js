import React, { useEffect } from 'react'; // React와 useEffect 훅 임포트
import { View, ActivityIndicator } from 'react-native'; // 로딩 스피너를 위한 ActivityIndicator
import { StatusBar } from 'expo-status-bar'; // StatusBar 관리
import Navigation from './Navigations/Navigation'; // 네비게이션 임포트
import { UserProvider } from './Contexts/UserContext'; // Context Provider 임포트
import * as SplashScreen from 'expo-splash-screen'; // SplashScreen 관리

const App = () => {
  // SplashScreen 초기화 및 숨김 처리
  useEffect(() => {
    const prepare = async () => {
      try {
        // SplashScreen 숨김 방지
        await SplashScreen.preventAutoHideAsync();
        console.log('SplashScreen 준비 완료');
        // 데이터 로드 및 초기화 작업 수행
        setTimeout(async () => {
          await SplashScreen.hideAsync(); // SplashScreen 숨김
        }, 2000); // 2초 후에 SplashScreen 숨김
      } catch (err) {
        console.error('SplashScreen 에러:', err);
        await SplashScreen.hideAsync(); // 에러 발생 시에도 SplashScreen 숨김
      }
    };
  
    prepare();
  }, []);
  

  // 컴포넌트 렌더링
  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        {/* StatusBar 설정 */}
        <StatusBar style="auto" />
        {/* 네비게이션 */}
        <Navigation />
      </View>
    </UserProvider>
  );
};

export default App;

import AuthStack from './AuthStack';
import * as SplashScreen from 'expo-splash-screen';
import { useUserState } from '../Contexts/UserContext';
import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import ContentTab from './ContentTap';

const Navigation = () => {
  const [user] = useUserState(); // UserContext에서 유저 상태 가져오기
  console.log('현재 user 상태:', user);

  const [isReady, setIsReady] = useState(false); // SplashScreen 준비 상태

  useEffect(() => {
    // SplashScreen 초기화
    (async () => {
      try {
        console.log('SplashScreen 초기화 시작');
        await SplashScreen.preventAutoHideAsync();
        console.log('SplashScreen 숨김 방지 완료');

        // Asset 로드
        await Asset.fromModule(require('../assets/cover.png')).downloadAsync();
        console.log('Asset 다운로드 완료');
      } catch (e) {
        console.error('SplashScreen 로드 중 오류 발생:', e);
      } finally {
        setIsReady(true); // 준비 완료 상태
      }
    })();
  }, []);

  const onReady = async () => {
    // 준비 완료되면 SplashScreen 숨김
    if (isReady) {
      console.log('SplashScreen 숨기기 실행');
      await SplashScreen.hideAsync();
    }
  };

  // 준비되지 않은 경우 아무것도 렌더링하지 않음
  if (!isReady) {
    console.log('SplashScreen 준비되지 않음');
    return null;
  }

  return (
      /* 유저 상태에 따라 AuthStack 또는 ContentTab 렌더링 */
      user && user.id ? <ContentTab /> : <AuthStack />
  );
};

export default Navigation;

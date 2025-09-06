import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


// --- 스크린 컴포넌트 임포트 ---
import CalendarScreen from '../Screens/CalendarScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import MainStack from './MainStack';
import MapNavigation from './MapNavigation';

// --- 색상 및 이름 임포트 ---
import { GRAY, PRIMARY } from '../Colors'; // ** 기존 색상 파일 경로 확인
import { ContentRoutes } from './Routes'; // ** 기존 라우트 이름 파일 경로 확인

// 탭 네비게이터 생성
const Tab = createBottomTabNavigator();

// --- 탭 아이콘을 생성하는 헬퍼 함수 ---
// focused 상태에 따라 아이콘 모양(채움/테두리)과 색상이 바뀐다.
const getTabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <Ionicons name={iconName} size={size} color={color} />;
};

const CustomTabBarBackground = () => (
  <View style={styles.tabBarBackgroundShape} />
);

// --- 메인 탭 네비게이터 컴포넌트 ---
const ContentTab = () => {
  return (
    <Tab.Navigator
      // --- 탭 바 전체에 적용될 공통 스타일 옵션 ---
      screenOptions={{
        headerShown: false, //모든 탭의 헤더를 여기서 한 번에 숨김. (개별 스크린에서 헤더 관리)
        
        tabBarActiveTintColor: '#FF8C42', // 활성화된 아이콘 및 라벨 색상
        tabBarInactiveTintColor: GRAY.DARK, // 비활성화 색상은 그대로 유지

        tabBarShowLabel: true, // 라벨을 다시 표시

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: Platform.OS === 'ios' ? 5 : 10, 
        },
        
        // --- 탭 바 스타일 ---
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 85,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 5,
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarBackground: () => <CustomTabBarBackground />,
      }}
    >
      {/* --- 1. 캘린더 탭 --- */}
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: '캘린더',
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'calendar' }),
        }}
      />

      {/* --- 2. 일기(홈) 탭 --- */}
      <Tab.Screen
        name="Diary"
        component={MainStack}
        options={{
          title: '오늘의 식탁',
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'book' }),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2.7, // 글자 위치 조절
            marginBottom: Platform.OS === 'ios' ? 0 : 5,
          }
        }}
      />

      {/* --- 3. 지도 탭 --- */}
      <Tab.Screen
        name={ContentRoutes.LIST}
        component={MapNavigation}
        options={{
          title: '먹킷리스트',
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'location' }),
        }}
      />

      {/* --- 4. 프로필 탭 --- */}
      <Tab.Screen
        name={ContentRoutes.PROFILE}
        component={ProfileScreen}
        options={{
          title: '마이페이지',
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'person' }),
        }}
      />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  tabBarBackgroundShape: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
});


export default ContentTab;

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import ListScreen from '../Screens/ListScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import CalendarScreen from '../Screens/CalendarScreen';
import { ContentRoutes, MapRoutes } from './Routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY, BACKCARROT } from '../Colors';
import MapScreen from '../Screens/MapScreen';
import MapStack from './MapNavigation';
import MapNavigation from './MapNavigation';
import MainStack from './MainStack';  // ✅ MainStack 추가

const Tab = createBottomTabNavigator();

const getTabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const ContentTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: PRIMARY.DARK,
        tabBarInactiveTintColor: GRAY.DARK,
        tabBarShowLabel: false,
      }}
    >
       {/* ✅ 캘린더를 개별적인 탭으로 유지 */}
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'calendar' }),
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
        }}
      />

      {/* ✅ Diary 관련 화면들을 MainStack으로 묶음 */}
      <Tab.Screen
        name="Diary"
        component={MainStack}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'book' }),
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
          headerShown: false,  // ✅ MainStack 내에서 header 관리
        }}
      />

      {/* ✅ 지도 관련 화면 */}
      <Tab.Screen
        name={ContentRoutes.LIST}
        component={MapNavigation}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'post' }),
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
          headerShown: false,
        }}
      />

      {/* ✅ 프로필 화면 */}
      <Tab.Screen
        name={ContentRoutes.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'account' }),
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;

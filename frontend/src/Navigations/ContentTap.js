import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import ListScreen from '../Screens/ListScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { ContentRoutes, MapRoutes } from './Routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY, BACKCARROT } from '../Colors';
import MapScreen from '../Screens/MapScreen';
import MapStack from './MapNavigation';
import MapNavigation from './MapNavigation';
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
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: (props) => getTabBarIcon({ ...props, name: 'calendar' }),
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
        }}
      />
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

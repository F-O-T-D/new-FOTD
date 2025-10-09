import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from '../Screens/ListScreen';
import MapScreen from '../Screens/MapScreen';
import ListMapScreen from '../Screens/ListMapScreen';
import { BACKCARROT, PRIMARY } from '../Colors';
import { MapRoutes, ContentRoutes } from './Routes'; 

const Stack = createNativeStackNavigator();

const MapNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ContentRoutes.LIST}  // "ListScreen"을 ContentRoutes.LIST로 명확하게 등록
        component={ListScreen}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
        }}
      />
      <Stack.Screen
        name={MapRoutes.MAP}  // "MapScreen"을 MapRoutes.MAP으로 등록
        component={MapScreen}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
        }}
      />
      <Stack.Screen
        name={MapRoutes.LISTMAP}  // "ListMapScreen"을 MapRoutes.LISTMAP으로 등록
        component={ListMapScreen}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: BACKCARROT },
          headerTintColor: PRIMARY.DEFAULT,
        }}
      />
    </Stack.Navigator>
  );
};

export default MapNavigation;

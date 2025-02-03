import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../Colors';
import { MainRoutes } from './Routes';
import ProfileScreen from '../Screens/ProfileScreen';
import CalendarScreen from '../Screens/CalendarScreen';
import DiaryListScreen from '../Screens/DiaryListScreen';
import DiaryEntryScreen from '../Screens/DiaryEntryScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: WHITE } }}>
    
      <Stack.Screen name="DiaryListScreen" component={DiaryListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DiaryEntryScreen" component={DiaryEntryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainStack;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../Colors';
import { MainRoutes } from './Routes';
import ProfileScreen from '../Screens/ProfileScreen';
import CalendarScreen from '../Screens/CalendarScreen';
import TimelineScreen from '../Screens/TimelineScreen'
import DiaryListScreen from '../Screens/DiaryListScreen';
import DiaryEntryScreen from '../Screens/DiaryEntryScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: WHITE } }}>
       {/*TimelineScreen을 가장 첫 번째 스크린으로 등록한다. */}
      <Stack.Screen 
        name="TimelineScreen" 
        component={TimelineScreen} 
        options={{ headerShown: false }} 
      />

      {/* 기존 스크린들은 그 아래에 둔다. */}
      <Stack.Screen 
        name="DiaryListScreen" 
        component={DiaryListScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="DiaryEntryScreen" 
        component={DiaryEntryScreen} 
        options={{ headerShown: false }} 
      />
    
    </Stack.Navigator>
  );
};

export default MainStack;

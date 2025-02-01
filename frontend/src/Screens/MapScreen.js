import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text } from 'react-native';
import { WHITE, PRIMARY, BACKCARROT } from '../Colors';
import MiniButton from '../Components/MiniButton';
import axios from 'axios';
import { useReducer } from 'react';
import { authFormReducer, initAuthForm } from "../Reducers/authFormReducer";
import { useUserState } from '../Contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { ContentRoutes } from '../Navigations/Routes';
import config from '../config'; // config.js에서 API URL 가져오기




const MapScreen = ({ route }) => {
  const navigation = useNavigation(); 
  
  const [user] = useUserState()

  const { storeName, address, latitude, longitude } = route.params;


  const mapUrl = `https://map.kakao.com/link/map/${latitude},${longitude}`;

  const handleRegistration = async () => {
    console.log('user 정보:', user); // user 정보 확인
    console.log('user_id 확인:', user.user_id);
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/map/${user.user_id}`,
        {
          "userId": user.user_id,
          "name": storeName,
          "address": address,
          "lat": latitude,
          "lng": longitude
        });
      
      console.log('등록 작업 수행:', response.data)
      navigation.navigate(ContentRoutes.LIST,{ refresh: true });
      
    } catch (error) {
      console.error('등록 작업 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView source={{ uri: mapUrl }} />
      <View style={styles.textContainer}>
        <Text style={styles.input}>{storeName}</Text>
        <Text style={styles.input}>{address}</Text>
        <MiniButton
          title="등록하기"
          onPress={handleRegistration}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    backgroundColor: BACKCARROT,
    justifyContent: 'center', // 수직 방향 가운데 정렬
    alignItems: 'center', // 수평 방향 가운데 정렬
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: PRIMARY.DEFAULT,
    borderWidth: 2,
    margin: 10,
    padding: 10,
    width: 300,
    borderRadius: 20,
  },
});

export default MapScreen;
import React, { useState, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Platform,
} from 'react-native';
import { PRIMARY, WHITE } from '../Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MapRoutes } from '../Navigations/Routes';
import config from "../config";  // ✅ config.js에서 API 키 가져오기

const BOTTOM = 20;

const InputFAB = () => {
  const [showInput, setShowInput] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState(''); // 상세주소
  const [latitude, setLatitude] = useState(0); // 위도
  const [longitude, setLongitude] = useState(0); // 경도

  const navigation = useNavigation(); // useNavigation 훅 사용

  const [keyboardHeight, setKetboardHeight] = useState(BOTTOM);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', (e) => {
        setKetboardHeight(e.endCoordinates.height + BOTTOM);
      });
      Keyboard.addListener('keyboardWillHide', () => {
        setKetboardHeight(BOTTOM);
      });
    }
  }, []);

  const toggleInput = () => {
    setShowInput(!showInput);
    setStoreName('');
    setAddress('');
    setLatitude(0);
    setLongitude(0);
  };

  // ✅ Kakao API를 호출하여 가게 주소 가져오기
  const getStoreAddress = async () => {
    try {
      console.log(`🔍 Kakao API 요청: ${storeName}`); // ✅ 검색어 확인 로그 추가

      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${storeName}`,
        {
          method: 'GET',
          headers: {
            Authorization: `KakaoAK ${config.KAKAO_REST_API_KEY}`, // ✅ REST API 키 적용
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Response Status:', response.status); // ✅ 응답 상태 확인
      const data = await response.json();
      console.log('📍 Kakao API 응답 데이터:', data); // ✅ 응답 데이터 확인

      if (data.documents && data.documents.length > 0) {
        const firstResult = data.documents[0];
        setAddress(firstResult.address_name);
        setLatitude(firstResult.y);
        setLongitude(firstResult.x);

        console.log('storeName:', storeName);
        console.log('Address:', firstResult.address_name);
        console.log('Latitude:', firstResult.y);
        console.log('Longitude:', firstResult.x);

        return firstResult; // ✅ 검색된 장소 데이터를 반환
      } else {
        console.log('❌ No results found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      return null;
    }
  };

  // ✅ 검색된 장소를 지도 화면으로 이동시키는 함수
  const navigateToMapScreen = (result) => {
    if (result) {
      navigation.navigate(MapRoutes.MAP, {
        storeName: storeName,
        address: result.address_name,
        latitude: result.y,
        longitude: result.x,
      });
    }
  };

  // ✅ 버튼 클릭 시 실행되는 함수 (비동기 처리 개선)
  const onPressButton = async () => {
    if (showInput) {
      if (storeName.trim() !== '') {
        const result = await getStoreAddress(); // ✅ 가게 검색 API 호출

        if (result) {
          navigateToMapScreen(result); // ✅ 검색 결과를 지도 화면으로 이동
        }
        
        toggleInput(); // ✅ 검색 후 입력창 닫기
      } else {
        toggleInput();
      }
    } else {
      toggleInput();
    }
  };

  return (
    <View
      style={[
        styles.container,
        showInput && styles.expandedContainer,
        { bottom: keyboardHeight },
      ]}
    >
      {showInput ? (
        <TextInput
          style={[styles.input, showInput && styles.expandedInput,
            { borderColor: PRIMARY.DEFAULT, borderWidth: 1 },]}
          placeholder="가게 이름을 입력해주세요."
          value={storeName}
          onChangeText={setStoreName}
          multiline={true}
          autoFocus={true}
          fontSize={19}
        />
      ) : null}
      <Pressable
        style={[
          styles.button,
          showInput && styles.expandedButton,
          { bottom: BOTTOM },
        ]}
        onPress={onPressButton}
      >
        <MaterialCommunityIcons
          name={showInput ? 'check' : 'magnify'}
          size={24}
          color={WHITE}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContainer: {
    width: '90%',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 30,
    bottom: BOTTOM,
  },
  expandedInput: {
    height: 60, // Adjust the desired height
    width: 200,
    bottom: BOTTOM,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: BOTTOM,
  },
  expandedButton: {
    width: 60,
    height: 60,
    bottom: BOTTOM,
  },
});

export default InputFAB;

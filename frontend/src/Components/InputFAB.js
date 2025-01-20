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

const BOTTOM = 20;
const KAKAO_REST_API_KEY = '3426840577241300296b9ffb9dd7d3f4';

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

  const getStoreAddress = async () => {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${storeName}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
        }
      );

      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        const firstResult = data.documents[0];
        setAddress(firstResult.address_name);
        setLatitude(firstResult.y);
        setLongitude(firstResult.x);

        console.log('storeName:', storeName);
        console.log('Address:', firstResult.address_name);
        console.log('Latitude:', firstResult.y);
        console.log('Longitude:', firstResult.x);

        navigateToMapScreen(firstResult);
        toggleInput(); // 상세주소, 위도, 경도 설정 후에 입력 창 닫기
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const navigateToMapScreen = (result) => {
    if (result) {
      // result가 유효한지 확인
      navigation.navigate(MapRoutes.MAP, {
        storeName: storeName,
        address: result.address_name,
        latitude: result.y,
        longitude: result.x,
      });
    }
  };

  const onPressButton = () => {
    if (showInput) {
      if (storeName.trim() !== '') {
        getStoreAddress()
          .then(() => {
            navigateToMapScreen();
            toggleInput();
          })
          .catch((error) => {
            console.error('Error:', error);
            toggleInput();
          });
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

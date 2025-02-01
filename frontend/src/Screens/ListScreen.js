/*
가게 목록 화면 (메인 화면)

사용자가 추가한 가게 목록을 보여줌.
InputFAB 버튼을 눌러 MapScreen.js로 이동.
*/

import { TextInput, View } from 'react-native';
import { BACKCARROT, GRAY } from '../Colors';
import EmptyList from '../Components/EmptyList';
import List from '../Components/List';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InputFAB from '../Components/InputFAB';
import { useNavigation } from '@react-navigation/native';
import { MapRoutes } from '../Navigations/Routes';
import React, { useState, useEffect } from 'react';
import { useUserState } from '../Contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import config from '../config'; // config.js에서 API URL 가져오기


const ListScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [restauList, setRestauList] = useState([]);
  const [user, setUser] = useUserState();
  const isFocused = useIsFocused();

  // 사용자의 가게 목록을 서버에서 가져와 상태로 저장
  const fetchRestauList = async (userId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/map/${userId}/store`);
      const data = await response.json();
      console.log('Fetched data:', data); // 'data' 객체 콘솔에 출력
      setRestauList(data); // 가게 정보를 state에 저장
    } catch (error) {
      console.error('가게 정보를 불러오는데 오류 발생:', error);
    }
  };

  //특정 가게 삭제, 삭제후 최신 목록 다시 가져옴
  const handleDeleteItem = async (deletedItemId) => {
    try {
      await axios.delete(
        `${config.API_BASE_URL}/api/map/${user.user_id}/store/${deletedItemId}`
      );
      console.log(`가게가 삭제되었습니다.`);

      // 서버에서 업데이트된 가게 정보를 다시 불러와서 상태를 업데이트
      try {
        const updatedResponse = await fetch(`${config.API_BASE_URL}/api/map/${user.user_id}/store`);
        const updatedData = await updatedResponse.json();
        setRestauList(updatedData);
      } catch (error) {
        console.error('가게 정보 업데이트 오류:', error);
      }
    } catch (error) {
      console.error('가게 삭제 오류:', error);
    }
  };

  //지도화면으로 이동
  const buttonPress = () => {
    console.log("📍 버튼 눌림! lat, lng 값:", lat, lng); // ✅ 로그 추가
    navigation.navigate(MapRoutes.MAP, {
      latitude: lat,
      longitude: lng,
    });
  };
  

//화면이 포커스될 때마다 가게 목록을 갱신
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 useFocusEffect 실행됨! user_id:", user?.user_id); // ✅ 로그 추가
  
      const fetchUpdatedList = async () => {
        try {
          await fetchRestauList(user.user_id);
        } catch (error) {
          console.error('업데이트된 리스트 불러오기 오류:', error);
        }
      };

      fetchUpdatedList();
    }, [user.user_id, isFocused]) // 의존성 배열을 추가하여 user.user_id가 변경될 때마다 실행되도록 설정
  );

  return (
    <View
      style={{ flex: 1, paddingBottom: bottom, backgroundColor: BACKCARROT }}
    >
      {restauList.length ? <List data={restauList} onDeleteItem={handleDeleteItem} /> : <EmptyList />}
      <InputFAB onSubmit={() => {
        console.log("✅ InputFAB 버튼 클릭됨!");
        buttonPress();
        }} />    
      </View>
  );
};
// 버튼에서 위도 경도 전달해 주면 된다..
export default ListScreen;


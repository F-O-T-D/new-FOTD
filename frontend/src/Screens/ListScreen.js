/*
가게 목록 화면

사용자가 추가한 가게 목록을 보여줌.
InputFAB 버튼을 눌러 MapScreen.js로 이동.
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { BACKCARROT, GRAY } from '../Colors';
import EmptyList from '../Components/EmptyList';
import List from '../Components/List';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InputFAB from '../Components/InputFAB';
import { useNavigation } from '@react-navigation/native';
import { MapRoutes } from '../Navigations/Routes';
import { Ionicons } from '@expo/vector-icons';
import { useUserState } from '../Contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import config from '../config'; // config.js에서 API URL 가져오기


const ListScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [restauList, setRestauList] = useState([]);
  const [filteredRestauList, setFilteredRestauList] = useState([]); // 필터링된 가게 목록 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useUserState();
  const isFocused = useIsFocused();

  // 사용자의 가게 목록을 서버에서 가져와 상태로 저장
  const fetchRestauList = async (userId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/users/${userId}/muckits`);
      const data = await response.json();
      console.log('Fetched data:', data); // 'data' 객체 콘솔에 출력
      setRestauList(data.data); // 가게 정보를 state에 저장, .data를 한 번 더 붙여서 배열을 꺼내온다
      setFilteredRestauList(data.data); // 검색어 필터링을 위한 초기값 설정
    } catch (error) {
      console.error('가게 정보를 불러오는데 오류 발생:', error);
    }
  };

  // 검색 기능
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredRestauList(restauList);
    } else {
      const filtered = restauList.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRestauList(filtered);
    }
  };


  //특정 가게 삭제, 삭제후 최신 목록 다시 가져옴
  const handleDeleteItem = async (deletedItemId) => {
    try {
      await axios.delete(
        `${config.API_BASE_URL}/api/users/${user.id}/muckits/${deletedItemId}`
      );
      console.log(`가게가 삭제되었습니다.`);

      // 서버에서 업데이트된 가게 정보를 다시 불러와서 상태를 업데이트
      try {
        const updatedResponse = await fetch(`${config.API_BASE_URL}/api/users/${user.id}/muckits`);
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
    console.log("버튼 눌림! searchQuery 값:", searchQuery);
  
    navigation.navigate(MapRoutes.MAP, {
      searchQuery: searchQuery, // 검색어 함께 전달
    });
  };
  
  

//화면이 포커스될 때마다 가게 목록을 갱신
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 useFocusEffect 실행됨! userId:", user?.id); // 로그 추가
  
      const fetchUpdatedList = async () => {
        try {
          await fetchRestauList(user.id);
        } catch (error) {
          console.error('업데이트된 리스트 불러오기 오류:', error);
        }
      };

      fetchUpdatedList();
    }, [user.id, isFocused]) // 의존성 배열을 추가하여 user.id가 변경될 때마다 실행되도록 설정
  );

  return (
    <View style={styles.container}>
      {/* 화면 제목 */}
      <View style={styles.header}>
        <Ionicons name="storefront-outline" size={26} color="#F97316" />
        <Text style={styles.headerTitle}>나의 가게 리스트</Text>
      </View>

{/* 검색 입력 */}
<View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="가게 이름 검색"
          value={searchQuery}
          onChangeText={handleSearch} // 검색어 입력 이벤트 적용
        />
      </View>

      {/* 가게 목록 or 비어있을 때 메시지 */}
      {restauList.length ? (
        <List data={restauList} onDeleteItem={handleDeleteItem} />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={50} color="#D3D3D3" />
          <Text style={styles.emptyMessage}>아직 등록된 가게가 없어요!</Text>
          <Text style={styles.emptySubText}>오른쪽 아래 버튼을 눌러 가게를 추가해보세요.</Text>
        </View>
      )}

      {/* ✨ 둥근 FAB 버튼 */}
      <TouchableOpacity style={styles.fabButton} onPress={buttonPress}>
        <Ionicons name="add" size={34} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F3', // 좀 더 따뜻한 크림톤 배경
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 50,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
  },
  fabButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 70,
    height: 70,
    backgroundColor: '#FF8C42',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
// 버튼에서 위도 경도 전달해 주면 된다..
export default ListScreen;


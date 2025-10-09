/*
가게 목록 화면

사용자가 추가한 가게 목록을 보여줌.
InputFAB 버튼을 눌러 MapScreen.js로 이동.
*/

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import List from '../Components/List';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MapRoutes } from '../Navigations/Routes';
import { Ionicons } from '@expo/vector-icons';
import { useUserState } from '../Contexts/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import config from '../config'; // config.js에서 API URL 가져오기


const ListScreen = () => {
  const navigation = useNavigation();
  const [restauList, setRestauList] = useState([]);
  const [filteredRestauList, setFilteredRestauList] = useState([]); // 필터링된 가게 목록 상태 추가
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useUserState();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState('WISHED'); // 기본값은 '가고 싶은 곳'

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

  const handleSearch = (query) => {
    setSearchQuery(query);
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

    //특정 가게 삭제, 삭제후 최신 목록 다시 가져옴
  const handleDeleteItem = async (deletedItemId) => {
      Alert.alert("삭제 확인", "정말로 이 가게를 삭제하시겠어요?", [
          { text: "취소", style: "cancel" },
          {
              text: "삭제", style: "destructive",
              onPress: async () => {
                //기존 목록을 백업
                const originalList = [...restauList];
                
                // UI를 즉시 업데이트 (화면에서 해당 아이템 제거)
                setRestauList(currentList => currentList.filter(item => item.id !== deletedItemId));

                  try {
                    //백그라운드에서 서버에 삭제 요청
                      await axios.delete(`${config.API_BASE_URL}/api/users/${user.id}/muckits/${deletedItemId}`);
                      
                  } catch (error) {
                      console.error('가게 삭제 오류:', error);
                      setRestauList(originalList); 
                      Alert.alert("삭제 실패", "오류가 발생했습니다.");
                  }
              }
          }
      ]);
  };

  // 전체 목록에서 '가고 싶은 곳'과 '다녀온 곳' 목록을 분리
  const wishedList = useMemo(() => restauList.filter(item => item.status === 'WISHED'), [restauList]);
  const visitedList = useMemo(() => restauList.filter(item => item.status === 'VISITED'), [restauList]);

  // 가게의 상태를 변경하는 함수
  const handleStatusUpdate = (item, newStatus) => { // ❗️ 1. newStatus 파라미터 추가
      const message = newStatus === 'VISITED' 
          ? `'${item.name}'을(를) 다녀오셨나요?` 
          : `'${item.name}'을(를) 다시 '가고 싶은 곳'으로 옮길까요?`;

      Alert.alert("상태 변경", message, [
          { text: "취소", style: "cancel" },
          {
              text: "확인",
              onPress: async () => {

                const originalList = [...restauList];

                // UI를 즉시 업데이트
                setRestauList(currentList => 
                    currentList.map(m => 
                        m.id === item.id ? { ...m, status: newStatus } : m
                    )
                );

                  try {
                      // newStatus를 API 요청
                      await axios.patch(`${config.API_BASE_URL}/api/users/${user.id}/muckits/${item.id}`, { status: newStatus });
                      
                      // VISITED로 변경할 때만 일기 작성 묻기
                      if (newStatus === 'VISITED') {
                          promptCreateDiary(item);
                      }
                  } catch (error) { 
                    console.error('상태 업데이트 오류:', error);
                    // 실패 시, UI를 원래대로 되돌림
                    setRestauList(originalList);
                    Alert.alert("오류", "상태 변경에 실패했습니다."); }
              },
          },
      ]);
  };

  // 일기 작성 여부를 묻는 함수
  const promptCreateDiary = (item) => {
      Alert.alert(
          "일기 작성",
          `'${item.name}' 방문 기록을 남기시겠어요?`,
          [
              { text: "나중에 할게요", style: "cancel" },
              {
                  text: "작성하기",
                  onPress: () => {
                      const today = new Date().toISOString().split('T')[0];
                      // 일기 작성 화면으로 이동하며, 가게 이름을 제목 초기값으로 전달
                      navigation.navigate('Diary', { // 1. 'Diary'라는 이름의 탭으로 먼저 이동하고,
                        screen: 'DiaryEntryScreen', // 2. 그 안에서 'DiaryEntryScreen' 화면을 찾아라
                        params: { 
                          date: today,
                          initialData: { title: item.name },
                          muckitId: item.id
                        }
                      });
                  }
              }
          ]
      )
  };



  //지도화면으로 이동
  const buttonPress = () => {
    console.log("버튼 눌림! searchQuery 값:", searchQuery);
  
    navigation.navigate(MapRoutes.MAP, {
      searchQuery: searchQuery, // 검색어 함께 전달
    });
  };
  
  const renderMuckitItem = ({ item }) => (
      <View style={styles.itemContainer}>
          <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemAddress}>{item.address}</Text>
          </View>
          {/* '가고 싶은 곳' 탭일 때만 '다녀왔어요!' 버튼 표시 */}
          {activeTab === 'WISHED' && (
              <TouchableOpacity style={styles.visitedButton} onPress={() => handleStatusUpdate(item)}>
                  <Text style={styles.visitedButtonText}>✅</Text>
              </TouchableOpacity>
          )}
      </View>
  );


      // 탭(가고 싶은 곳, 다녀온 곳)과 검색어에 따라 보여줄 목록을 필터링 함
    const filteredList = useMemo(() => {
        const sourceList = restauList.filter(item => item.status === activeTab);
        if (!searchQuery.trim()) {
            return sourceList;
        }
        return sourceList.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [restauList, activeTab, searchQuery]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="location-outline" size={26} color="#F97316" />
                <Text style={styles.headerTitle}>나의 먹킷리스트</Text>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="저장된 가게 이름 검색"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'WISHED' && styles.activeTab]}
                    onPress={() => setActiveTab('WISHED')}
                >
                    <Text style={[styles.tabText, activeTab === 'WISHED' && styles.activeTabText]}>가고 싶은 곳</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'VISITED' && styles.activeTab]}
                    onPress={() => setActiveTab('VISITED')}
                >
                    <Text style={[styles.tabText, activeTab === 'VISITED' && styles.activeTabText]}>다녀온 곳</Text>
                </TouchableOpacity>
            </View>

            {/* 기존 List 컴포넌트에 필요한 props를 모두 전달 */}
            {filteredList.length > 0 ? (
                <List 
                    data={filteredList} 
                    onDeleteItem={handleDeleteItem} 
                    onUpdateStatus={handleStatusUpdate}
                    activeTab={activeTab}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyMessage}>목록이 비어있어요.</Text>
                </View>
            )}

            <TouchableOpacity 
                style={styles.fabButton} 
                onPress={() => navigation.navigate(MapRoutes.MAP)}
            >
                <Ionicons name="add" size={34} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF9F3' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 15, marginHorizontal: 20, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#F97316', marginLeft: 10 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, borderRadius: 10, height: 50, marginHorizontal: 20, marginTop: 12, marginBottom: 10, elevation: 1 },
    searchInput: { flex: 1, fontSize: 16, marginLeft: 10, color: '#333' },
    tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 15, backgroundColor: '#eee', borderRadius: 10, padding: 4 },
    tab: { flex: 1, paddingVertical: 8, borderRadius: 8 },
    activeTab: { backgroundColor: 'white', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    tabText: { textAlign: 'center', fontSize: 16, color: '#555' },
    activeTabText: { fontWeight: 'bold', color: '#F97316' },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyMessage: { fontSize: 16, color: '#999' },
    fabButton: { position: 'absolute', bottom: 30, right: 20, width: 70, height: 70, backgroundColor: '#FF8C42', borderRadius: 35, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
});
export default ListScreen;


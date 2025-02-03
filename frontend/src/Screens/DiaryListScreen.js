import React, { useState, useEffect } from 'react';  // ✅ useState, useEffect 추가!
import { View, Text, Button, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUserState } from '../Contexts/UserContext';  // ✅ 유저 상태 가져오기
import config from '../config';

const DiaryListScreen = ({ route }) => {

  console.log("📝 route.params 확인:", route.params);  // ✅ route.params 로그 찍기
  if (!route.params || !route.params.date) {
    return (
        <View style={styles.container}>
            <Text>🚨 날짜 정보가 없습니다. 다시 선택해주세요.</Text>
        </View>
    );
}
    const { date } = route.params;
    const navigation = useNavigation();
    const [diaryEntries, setDiaryEntries] = useState([]); // ✅ useState 추가
    const [user] = useUserState();  // ✅ 현재 로그인된 유저 가져오기

    console.log("👤 현재 로그인한 유저:", user); // ✅ 유저 데이터 로그 찍기

    useEffect(() => {
      fetchDiaryEntries();
  }, [date]); // ✅ date 변경될 때마다 다시 fetch
  
    const fetchDiaryEntries = async () => {
      try {

        if (!user?.user_id) {
          console.warn("⚠️ user_id가 없음! 로그인 확인 필요");
          return;
      }
        console.log(`🔍 ${date}의 일기 데이터를 불러옵니다.`);
        const response = await axios.get(`${config.API_BASE_URL}/api/diary/${user.user_id}/diaries`, {
            params: { date }  // 📌 쿼리 파라미터로 날짜 전달
        });        
        
        console.log("✅ 가져온 일기 목록:", response.data);
        setDiaryEntries(response.data);
        console.log("📌 저장된 상태 확인:", diaryEntries); // ✅ 추가된 로그
      } catch (error) {
        console.error('📌 일기 조회 오류:', error);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.header}>📖 {date}의 음식 일기 목록</Text>
    
          {diaryEntries.length === 0 ? (
              <Text style={styles.emptyMessage}>📌 저장된 일기가 없습니다.</Text>
          ) : (
              <FlatList
                  data={diaryEntries}
                  extraData={diaryEntries} // ✅ 상태 변경 감지
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                      <View style={styles.diaryItem}>
                          {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                          <Text style={styles.diaryContent}>{item.content}</Text>
                      </View>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />} // ✅ 항목 간격 추가
              />
          )}
    
          <Button title="새 일기 작성" onPress={() => navigation.navigate('DiaryEntryScreen', { date })} />
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EC', // ✅ 배경색 추가
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 10,
    marginTop: 20,  
},
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  diaryItem: {
    width: '100%',  // ✅ 부모 요소와 동일한 너비
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'column', //이미지+텍스트 정렬
    alignItems: 'center',
    paddingHorizontal: 20, // ✅ 좌우 여백 추가
},
  diaryContent: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: undefined,  // ✅ 고정 높이 제거
    aspectRatio: 1.5,   // ✅ 가로/세로 비율 유지 (1.5:1)
    borderRadius: 10,
    resizeMode: 'cover', // ✅ 이미지 비율 유지
},
  separator: {
    height: 15, // ✅ 아이템 간격 추가
  },
});


export default DiaryListScreen;

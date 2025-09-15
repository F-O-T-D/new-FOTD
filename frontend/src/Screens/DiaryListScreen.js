import React, { useState, useEffect } from 'react';  // useState, useEffect 추가!
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUserState } from '../Contexts/UserContext';  // 유저 상태 가져오기
import { Ionicons } from '@expo/vector-icons'; // 아이콘 추가
import config from '../config';

const DiaryListScreen = ({ route }) => {

  console.log("route.params 확인:", route.params);  // route.params 로그 찍기
  if (!route.params || !route.params.date) {
    return (
        <View style={styles.container}>
            <Text>날짜 정보가 없습니다. 다시 선택해주세요.</Text>
        </View>
    );
}
    const { date } = route.params;
    const navigation = useNavigation();
    const [diaryEntries, setDiaryEntries] = useState([]); // useState 추가
    const [user] = useUserState();  // 현재 로그인된 유저 가져오기

    console.log("👤 현재 로그인한 유저:", user); // 유저 데이터 로그 찍기

    useEffect(() => {
      fetchDiaryEntries();
  }, [date]); // date 변경될 때마다 다시 fetch
  
    const fetchDiaryEntries = async () => {
      try {

        if (!user?.user_id) {
          console.warn("user_id가 없음! 로그인 확인 필요");
          return;
      }
        console.log(`${date}의 일기 데이터를 불러옵니다.`);
        const response = await axios.get(`${config.API_BASE_URL}/api/diary/${user.user_id}/diaries`, {
            params: { date }  // 쿼리 파라미터로 날짜 전달
        });        
        
        console.log("가져온 일기 목록:", response.data);
        setDiaryEntries(response.data);
        console.log("저장된 상태 확인:", diaryEntries); // 추가된 로그
      } catch (error) {
        console.error('일기 조회 오류:', error);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
          {/* 날짜 띄우는 부분 */}
      <View style={styles.dateFloating}>
        <Ionicons name="calendar" size={20} color="#FF8C42" />
        <Text style={styles.dateText}>{date}의 음식 일기</Text>
      </View>
          {diaryEntries.length === 0 ? (
              <Text style={styles.emptyMessage}>🍽️ 아직 기록이 없어요!</Text>
          ) : (
              <FlatList
                  data={diaryEntries}
                  extraData={diaryEntries} // 상태 변경 감지
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                      <View style={styles.diaryItem}>
                            <Text style={styles.diaryTitle}>{item.title ? String(item.title) : "제목 없음"}</Text>
                            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                          <Text style={styles.diaryContent}>{item.content}</Text>
                      </View>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />} // 항목 간격 추가
                  contentContainerStyle={{ paddingBottom: 30 }} // 하단 여백 추가하여 버튼 가리지 않기

              />
          )}
    
           {/* 새 일기 작성 버튼 */}
           <TouchableOpacity 
             style={styles.fabButton} 
             onPress={() => navigation.navigate('DiaryEntryScreen', { date })}
          >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6EC',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dateFloating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.91)', 
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C42',
    marginLeft: 5,  // 아이콘과 간격
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  diaryItem: {
    width: '100%',  // 부모 요소와 동일한 너비
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'column', //이미지+텍스트
    alignItems: 'center',
    paddingHorizontal: 20, // 좌우 여백 추가
},
diaryTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000000', 
  textAlign: 'center',
  marginBottom: 15,
  fontFamily: 'System', // 기본 폰트 사용 가능
},
diaryContent: {
  fontSize: 16,
  color: '#555',
  textAlign: 'center',
  lineHeight: 22,
  marginTop: 15,
},
  image: {
    width: '100%',
    height: undefined,  // 고정 높이 제거
    aspectRatio: 1,   
    borderRadius: 10,
    resizeMode: 'cover', 
},
  separator: {
    height: 15, // 아이템 간격 추가
  },
  fabButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 140, 66, 0.85)',
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default DiaryListScreen;

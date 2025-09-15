import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; 

import config from '../config';
import { useUserState } from '../Contexts/UserContext'; // UserContext 경로

// 날짜를 'YYYY년 MM월 DD일' 형식으로 바꿔주는 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};


// --- 미리보기 영역의 일기 아이템 컴포넌트 ---
const DiaryItem = ({ item }) => {
    const navigation = useNavigation();
    // [수정] 아이템 클릭 시 상세 페이지로 이동하도록 navigation 추가
    return (
        <TouchableOpacity 
            style={styles.diaryItemContainer}
            // DiaryDetailScreen 같은 상세 페이지가 있다면 아래처럼 연결 가능
            // onPress={() => navigation.navigate('Diary', { screen: 'DiaryDetailScreen', params: { diaryId: item.id } })}
        >
            <Image source={{ uri: item.image }} style={styles.diaryItemImage} />
            <View style={styles.diaryItemTextContainer}>
                <Text style={styles.diaryItemTitle}>{item.title}</Text>
                <Text style={styles.diaryItemContent} numberOfLines={1}>{item.content}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D3D3D3" />
        </TouchableOpacity>
    );
};


// --- CalendarScreen 메인 컴포넌트 ---
const CalendarScreen = () => {
  const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 저장하는 변수
  const [selectedDate, setSelectedDate] = useState(today);
  const [dailyData, setDailyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const navigation = useNavigation();
  const [user] = useUserState(); // UserContext에서 현재 로그인된 유저 정보 가져오기

    const markedDates = {
      [selectedDate]: { selected: true, selectedColor: '#F97316' }
    };

    const fetchDiariesForDate = useCallback(async (date) => {

    // 유저 정보가 없으면 API를 호출하지 않음
    if (!user?.id) {
        setIsLoading(false);
        return;
    }

      setIsLoading(true);
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/diary/${user.id}/diaries`, {
          params: { date: date }
        });
        setDailyData(response.data);
      } catch (error) {
        console.error('일기 데이터를 불러오는 데 실패했습니다:', error);
        setDailyData([]);
      } finally {
        setIsLoading(false);
      }
    }, [user]); //user가 변경될 때 함수를 새로 만들도록 의존성 배열에 추가


    //useEffect: selectedDate가 변경될 때마다 서버에 데이터를 요청
    useEffect(() => {

      fetchDiariesForDate(selectedDate);
    }, [selectedDate, fetchDiariesForDate]);

    //날짜를 누르면 실행되는 함수
    const handleDayPress = (day) => {

    //선택된 날짜를 상태에 저장(화면에 선택표시를 하기 위해)
    setSelectedDate(day.dateString);
    
    // //'DiaryListScreen'으로 이동하면서 날짜 정보 파라미터로 전달, 'DiaryListScreen'에서 해당 날짜의 일기를 불러오게 됨
    // navigation.navigate('Diary', { screen: 'DiaryListScreen', params: { date: day.dateString } });  

  };

  return (
    <View style={styles.container}>
      {/* 헤더 UI */}
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={24} color="#F97316" />
        <Text style={styles.title}>날짜를 선택해 주세요!</Text>
      </View>
      
       {/* 캘린더 UI */}
      <View style={styles.calendarWrapper}>
        <Calendar
          current={today}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#FFF',
            calendarBackground: '#FFF',
            selectedDayBackgroundColor: '#F97316',
            todayTextColor: '#F97316',
            arrowColor: '#F97316',
            dayTextColor: '#333',
            textDisabledColor: '#D3D3D3',
            textSectionTitleColor: '#F97316',
            selectedDayTextColor: '#FFF',
            monthTextColor: '#F97316',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
      {/* '선택하기' 버튼을 제거하여 UI를 간소화하고 UX를 개선함. */}

       {/* 미리보기 영역 */}
      <View style={styles.previewContainer}>
        {isLoading ? (
          // --- 로딩 중일 때 ---
          <ActivityIndicator style={{flex: 1}} size="large" color="#FF8C42" />
        ) : dailyData.length > 0 ? (
          // --- 일기가 있을 때 ---
          <>
            <Text style={styles.previewTitle}>{formatDate(selectedDate)}의 기록</Text>
            <FlatList
              data={dailyData}
              renderItem={({ item }) => <DiaryItem item={item} />}
              keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => navigation.navigate('Diary', { screen: 'DiaryListScreen', params: { date: selectedDate } })}
            >
              <Text style={styles.moreButtonText}>전체 기록 보기</Text>
            </TouchableOpacity>
          </>
        ) : (
          // --- 일기가 없을 때 ---
          <View style={styles.noDataContainer}>
            <Ionicons name="restaurant-outline" size={48} color="#D3D3D3" />
            <Text style={styles.noDataText}>{formatDate(selectedDate)}에는 기록이 없어요.</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('Diary', { screen: 'DiaryEntryScreen', params: { date: selectedDate } })}
            >
              <Text style={styles.addButtonText}>+ 일기 추가하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDF6EC', 
    alignItems: 'center', 
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.91)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FF8C42', 
    marginLeft: 10,
  },
  calendarWrapper: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    marginTop: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  previewContainer: {
     flex: 1, width: '100%', backgroundColor: '#FFF', marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 5, 
    },
  previewTitle: { 
    fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, 
  },
  noDataContainer: { 
    flex: 1, justifyContent: 'center', alignItems: 'center', 
  },
  noDataText: { 
    fontSize: 16, color: '#888', marginTop: 10, marginBottom: 20, 
  },
  addButton: { 
    backgroundColor: '#FF8C42', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, 
  },
  addButtonText: { 
    color: '#FFF', fontSize: 16, fontWeight: 'bold', 
  },
  diaryItemContainer: { 
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', 

  },
  diaryItemImage: { 
    width: 50, height: 50, borderRadius: 10, marginRight: 15, 
  },
  diaryItemTextContainer: { 
    flex: 1, },
  diaryItemTitle: { 
    fontSize: 16, fontWeight: '600', color: '#333', 
  },
  diaryItemContent: { 
    fontSize: 14, color: '#777', marginTop: 4, 
  },
  moreButton: { 
    alignItems: 'center', paddingVertical: 15, marginTop: 10, 
  },
  moreButtonText: { 
    fontSize: 15, color: '#FF8C42', fontWeight: 'bold', 
  }

});

export default CalendarScreen;

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


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
const CalendarScreen = ({ diaries = [] }) => {
  const today = new Date().toISOString().split('T')[0]; // 오늘 날짜를 'YYYY-MM-DD' 형식의 문자열로 저장하는 변수
  const [selectedDate, setSelectedDate] = useState(today);
  const [dailyData, setDailyData] = useState([]);
  const navigation = useNavigation();

  //'markedDates'는 달력에 "기록이 있는 날짜"와 "선택된 날짜"를 표시하기 위한 정보를 담는 객체
  // useMemo는 [diaries, selectedDate]가 변경될 때만 이 계산을 다시 실행
  const markedDates = useMemo(() => {
    const marks = {};

    // 전체 일기(diaries)를 하나씩 확인하면서
    // 일기가 있는 모든 날짜에 연한 주황색 점(dotColor)을 찍음.
    diaries.forEach(diary => {
      marks[diary.date] = { marked: true, dotColor: '#FFCBA4' };
    });

    // 현재 "선택된 날짜(selectedDate)"에는
    // 진한 주황색 배경(selectedColor)을 덮어씌워 강조 표시
    marks[selectedDate] = { 
      selected: true, 
      selectedColor: '#F97316', 
      marked: !!marks[selectedDate] 
    };

    //마킹된 정보 반환
    return marks;
  }, [diaries, selectedDate]);

    useEffect(() => {

    // 전체 다이어리 목록 중 현재 선택된 날짜의 일기만 필터링
    const filteredDiaries = diaries.filter(diary => diary.date === selectedDate);
    
    // 필터링된 결과(그날의 일기)를 'dailyData' 상태에 저장.
    // 이 setDailyData가 실행되면, 화면 하단의 미리보기 영역이 새로운 내용으로 다시 렌더링
    setDailyData(filteredDiaries);
  }, [selectedDate, diaries]);


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
        {dailyData.length > 0 ? (
          <>
            <Text style={styles.previewTitle}>{formatDate(selectedDate)}의 기록</Text>
            <FlatList
              data={dailyData}
              renderItem={({ item }) => <DiaryItem item={item} />}
              keyExtractor={item => item.id.toString()} // key는 string 타입이어야 합니다.
            />
            {/* [수정] 네비게이션 경로 수정 */}
            <TouchableOpacity 
              style={styles.moreButton}
              onPress={() => navigation.navigate('Diary', { screen: 'DiaryListScreen', params: { date: selectedDate } })}
            >
              <Text style={styles.moreButtonText}>전체 기록 보기</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="restaurant-outline" size={48} color="#D3D3D3" />
            <Text style={styles.noDataText}>{formatDate(selectedDate)}에는 기록이 없어요.</Text>
            {/* [수정] 네비게이션 경로 수정 (일기 작성 화면으로) */}
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

// [수정] React.memo로 컴포넌트를 감싸서 export
export default React.memo(CalendarScreen);

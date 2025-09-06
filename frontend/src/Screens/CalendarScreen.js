import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();


  // 날짜를 누르면 실행되는 함수
  const handleDayPress = (day) => {

    //선택된 날짜를 상태에 저장(화면에 선택표시를 하기 위해)
    setSelectedDate(day.dateString);

    //'DiaryListScreen'으로 이동하면서 날짜 정보 파라미터로 전달, 'DiaryListScreen'에서 해당 날짜의 일기를 불러오게 됨
    navigation.navigate('Diary', { screen: 'DiaryListScreen', params: { date: day.dateString } });  
};

  return (
    <View style={styles.container}>
      {/* 상단 안내 문구 */}
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={24} color="#F97316" />
        <Text style={styles.title}>날짜를 선택해 주세요!</Text>
      </View>
      
       {/* 캘린더 */}
      <View style={styles.calendarWrapper}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: '#F97316' }
          }}
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
    // 버튼 관련 스타일(button, buttonDisabled, buttonText)은 더 이상 필요 없으므로 삭제했습니다.
});

export default CalendarScreen;

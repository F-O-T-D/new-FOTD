import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();



  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    navigation.navigate('Diary', { screen: 'DiaryListScreen', params: { date: day.dateString } });  
};

  return (
    <View style={styles.container}>
      {/* 📅 상단 안내 문구 */}
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={24} color="#F97316" />
        <Text style={styles.title}>날짜를 선택해 주세요!</Text>
      </View>
      
       {/* 📅 캘린더 */}
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

      {/* ✅ 버튼 */}
      <TouchableOpacity 
        style={[styles.button, !selectedDate && styles.buttonDisabled]} 
        onPress={() => navigation.navigate('DiaryListScreen', { date: selectedDate })}
        disabled={!selectedDate}
      >
        <Text style={styles.buttonText}>
          {selectedDate ? `선택하기` : '날짜를 선택하세요'}
        </Text>
      </TouchableOpacity>
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
  button: { 
    width: 327, 
    height: 50, 
    backgroundColor: '#FF8C42', 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});

export default CalendarScreen;

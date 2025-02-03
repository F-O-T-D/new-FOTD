import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const navigation = useNavigation();

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    navigation.navigate('Diary', { screen: 'DiaryListScreen', params: { date: day.dateString } });  
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 원하는 날짜를 선택해주세요!</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#F97316' }
        }}
        theme={{
          selectedDayBackgroundColor: '#F97316',
          todayTextColor: '#F97316',
          arrowColor: '#F97316',
        }}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DiaryListScreen', { date: selectedDate })}>
        <Text style={styles.buttonText}>선택하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5EC', alignItems: 'center', padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#F97316', marginBottom: 20 },
  button: { width: 327, height: 44, backgroundColor: '#F97316', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default CalendarScreen;

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DiaryListScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>📖 음식 일기 목록</Text>
      <Button
        title="7월 1일 일기 보기"
        onPress={() => navigation.navigate('DiaryEntryScreen', { date: '2025-07-01' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiaryListScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const DiaryEntryScreen = ({ route }) => {
  const { date } = route.params || {};  // ✅ 기본값 설정
  const navigation = useNavigation();
  const [foodImage, setFoodImage] = useState(null);
  const [content, setContent] = useState('');

  // ✅ 이미지 선택 함수 수정
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {  // ✅ 최신 버전에서는 `canceled`
      setFoodImage(result.assets[0].uri);  // ✅ `assets[0].uri`로 접근
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date ? `${date}의 음식 일기` : "날짜를 선택해주세요."}</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {foodImage ? <Image source={{ uri: foodImage }} style={styles.image} /> : <Text>이미지 추가</Text>}
      </TouchableOpacity>

      <Text style={styles.label}>내용을 입력하세요</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="음식 후기를 작성하세요"
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5EC', padding: 20, alignItems: 'center' },
  date: { fontSize: 18, fontWeight: 'bold', color: '#F97316', marginBottom: 10 },
  imageContainer: { width: 200, height: 200, backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { width: '90%', height: 100, borderWidth: 1, borderRadius: 10, padding: 10, backgroundColor: '#FFF' },
  saveButton: { width: 327, height: 44, backgroundColor: '#F97316', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default DiaryEntryScreen;

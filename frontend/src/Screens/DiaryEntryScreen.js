import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../Contexts/UserContext';  // ✅ 유저 상태 import
import axios from 'axios';
import config from '../config';

const DiaryEntryScreen = ({ route }) => {
  const { date } = route.params || {};  
  const navigation = useNavigation();
  const [foodImage, setFoodImage] = useState(null);
  const [content, setContent] = useState('');
  const [user] = useUserState();  // ✅ 현재 로그인된 유저 가져오기

  // ✅ 이미지 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoodImage(result.assets[0].uri);
    }
  };

  // ✅ "저장하기" 버튼을 눌렀을 때 서버로 데이터 전송
  const handleSave = async () => {
    try {
      if (!user?.user_id) {
        console.warn("⚠️ user_id가 없음! 저장 불가");
        return;
      }

      const newDiary = {
        userId: user.user_id,  // ✅ 올바른 user_id 사용
        date,
        content,
        image: foodImage || null,
      };

      console.log("🚀 저장 요청 데이터:", newDiary);

      const response = await axios.post(`${config.API_BASE_URL}/api/diary/${user.user_id}/diary`, newDiary); // ✅ URL 수정 (diaries → diary)
      console.log("✅ 저장 완료:", response.data);

      // 저장 후 DiaryListScreen으로 이동
      navigation.navigate("DiaryListScreen", { date });
    } catch (error) {
      console.error("❌ 저장 중 오류 발생:", error);
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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

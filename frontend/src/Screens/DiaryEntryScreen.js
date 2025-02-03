import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../Contexts/UserContext';
import axios from 'axios';
import config from '../config';

const DiaryEntryScreen = ({ route }) => {
  const { date } = route.params || {};  
  const navigation = useNavigation();
  const [foodImage, setFoodImage] = useState(null);
  const [content, setContent] = useState('');
  const [user] = useUserState();

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
        userId: user.user_id,
        date,
        content,
        image: foodImage || null,
      };

      console.log("🚀 저장 요청 데이터:", newDiary);

      const response = await axios.post(`${config.API_BASE_URL}/api/diary/${user.user_id}/diary`, newDiary);
      console.log("✅ 저장 완료:", response.data);

      // 저장 후 DiaryListScreen으로 이동
      navigation.navigate("DiaryListScreen", { date });
    } catch (error) {
      console.error("❌ 저장 중 오류 발생:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ 날짜 표시 */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      {/* ✅ 이미지 선택 */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {foodImage ? (
          <Image source={{ uri: foodImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>📷 사진 추가</Text>
        )}
      </TouchableOpacity>

      {/* ✅ 입력 필드 */}
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="음식 후기를 작성하세요"
        multiline
      />

      {/* ✅ 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EC',
    padding: 20,
    alignItems: 'center',

  },
  dateContainer: { 
    backgroundColor: '#F97316', 
    paddingVertical: 6, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    marginBottom: 15 
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  imageContainer: { 
    width: 250, 
    height: 180, 
    backgroundColor: '#EEE', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 15, 
    overflow: 'hidden', 
    marginBottom: 20 
  },
  imagePlaceholder: { 
    fontSize: 16, 
    color: '#999' 
  },
  image: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  input: {
    width: '90%',
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFF',
    fontSize: 16,
    marginBottom: 20, 
  },
  saveButton: { 
    width: '90%', 
    height: 50, 
    backgroundColor: '#F97316', 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  saveButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
});

export default DiaryEntryScreen;

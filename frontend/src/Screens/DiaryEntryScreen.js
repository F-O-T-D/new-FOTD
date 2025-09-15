import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Platform, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserState } from '../Contexts/UserContext';
import axios from 'axios';
import config from '../config';

const DiaryEntryScreen = ({ route }) => {
  const { date } = route.params || {};  
  const navigation = useNavigation();
  const [foodImage, setFoodImage] = useState(null);
  const [title, setTitle] = useState(''); // 제목 추가
  const [content, setContent] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [user] = useUserState();
  const scrollRef = useRef(null); //ScrollView를 제어하기 위한 ref

  // 이미지 선택 함수
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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // "저장하기" 버튼을 눌렀을 때 서버로 데이터 전송
  const handleSave = async () => {
    Keyboard.dismiss();  // 키보드 먼저 닫기
    try {
      if (!user?.id) {
        console.warn("userId가 없음! 저장 불가");
        return;
      }

      const newDiary = {
        userId: user.id,
        date,
        title,
        content,
        image: foodImage || null,
      };
      console.log("저장 요청 데이터:", newDiary);
      const response = await axios.post(`${config.API_BASE_URL}/api/diary/${user.id}/diary`, newDiary);
      console.log("저장 완료:", response.data);

      // 저장 후 DiaryListScreen으로 이동
      navigation.navigate("DiaryListScreen", { date });
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
    }
  };

  return (

    <View style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        {/* 헤더 부분은 스크롤과 무관하게 상단에 고정 */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>일기 쓰기</Text>
            <View style={{ width: 30 }} />
        </View>

        <ScrollView
            ref={scrollRef} // ❗️추가: ScrollView에 ref 연결
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.contentWrapper}>
              {/* 날짜 태그 */}
              <View style={styles.dateTag}>
                  <Text style={styles.dateText}>{date}</Text>
              </View>

              {/* 제목 입력란 */}
              <TextInput
                  style={styles.titleInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="제목을 입력하세요"
                />

              {/* 사진 추가 */}
              <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                  {foodImage ? (
                      <Image source={{ uri: foodImage }} style={styles.image} />
                  ) : (
                      <Text style={styles.imagePlaceholder}>📷 사진 추가</Text>
                  )}
              </TouchableOpacity>

              {/* 텍스트 입력 */}
              <TextInput
                  style={styles.input}
                  value={content}
                  onChangeText={setContent}
                  placeholder="음식 후기를 작성하세요"
                  multiline
                  onFocus={() => { // 입력창을 터치하면 스크롤을 맨 아래로 이동
                    setTimeout(() => {
                        scrollRef.current?.scrollToEnd({ animated: true });
                    }, 50); // 키보드가 올라올 시간.
                }}
              />

              {/* 저장 버튼 (애니메이션 추가) */}
              <Animated.View style={[styles.saveButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSave}
                  onPressIn={handlePressIn} 
                  onPressOut={handlePressOut}
                >
                  <Text style={styles.saveButtonText}>저장하기</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
      flex: 1,
      backgroundColor: '#FDF6EC',
  },

  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  contentWrapper: { // ❗️추가: 실제 콘텐츠를 감싸는 래퍼
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: "center",
    flex: 1,
  },
  dateTag: {
      backgroundColor: 'rgba(255, 140, 66, 0.85)',
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 20,
      marginTop: 20,
      marginBottom: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
  },
  dateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
  },
  titleInput: {
    width: '100%',
    height: 50,
    borderWidth: 0.5,
    borderColor: '#DDD',
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  image: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
  },
  imagePlaceholder: {
      fontSize: 16,
      color: '#888',
  },
  input: {
    width: '100%',
    minHeight: 100,
    borderWidth: 0.5,
    borderColor: '#DDD',
    borderRadius: 14,
    padding: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  saveButtonContainer: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
},

  saveButton: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(255, 140, 66, 0.85)',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  saveButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
});

export default DiaryEntryScreen;

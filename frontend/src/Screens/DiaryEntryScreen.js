import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Platform, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUserState } from '../Contexts/UserContext';
import axios from 'axios';
import config from '../config';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const moodEmoticons = ['😃', '😊', '😐', '😢', '😠']; // 이모티콘 목록

const DiaryEntryScreen = ({ route }) => {
  const navigation = useNavigation();
  const { diaryToEdit, date: newDate, initialData, muckitId } = route.params || {}; //수정할 데이터 or 새 글의 날짜를 받아옴
  const isEditing = !!diaryToEdit; //수정할 데이터가 있다면 수정모드

  const [date, setDate] = useState(diaryToEdit?.date || newDate || new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState(diaryToEdit?.title || initialData?.title || '');
  const [content, setContent] = useState(diaryToEdit?.content || '');
  const [foodImage, setFoodImage] = useState(diaryToEdit?.image || null);
  // 선택된 평점을 저장할 state 추가
  const [rating, setRating] = useState(diaryToEdit?.rating || null);
  // 날짜 선택기(모달)의 표시 여부를 관리할 state 추가
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [user] = useUserState();
  const scrollRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  //날짜 선택기 관련 함수들
  const showDatePicker = () => {
      setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
      setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
      // 선택된 날짜를 'YYYY-MM-DD' 형식으로 변환하여 state에 저장
      setDate(selectedDate.toISOString().split('T')[0]);
      hideDatePicker();
  };


  // 이미지 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
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

    if (!user?.id) {
      console.warn("userId가 없음! 저장 불가");
      return;
    }
      try {
        const diaryData = { //API에 보낼 데이터
          date, 
          title, 
          content, 
          image: foodImage,
          rating,
          muckitId };

      if (isEditing) {
          // '수정 모드'일 경우: PATCH API 호출
          await axios.patch(`${config.API_BASE_URL}/api/users/${user.id}/diaries/${diaryToEdit.id}`, diaryData);
      } else {
          // '새 글 작성' 모드일 경우: POST API 호출
          await axios.post(`${config.API_BASE_URL}/api/users/${user.id}/diaries`, diaryData);
      }
        // 저장 후 이전 화면으로 이동
        navigation.goBack();
      } catch (error) {
        console.error("저장/수정 중 오류 발생:", error);
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
            <Text style={styles.headerTitle}>{isEditing ? '일기 수정하기' : '일기 쓰기'}</Text>
            <View style={{ width: 30 }} />
        </View>

        <ScrollView
            ref={scrollRef} // 추가: ScrollView에 ref 연결
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.contentWrapper}>
              {/* 날짜 태그를 View에서 TouchableOpacity로 변경하고 onPress 추가 */}
              <TouchableOpacity onPress={showDatePicker} style={styles.dateTag}>
                  <Text style={styles.dateText}>{date}</Text>
              </TouchableOpacity>

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
                    {/* 이모티콘 선택 UI 추가 */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingLabel}>이 음식, 어떠셨나요?</Text>
                        <View style={styles.emoticonContainer}>
                            {moodEmoticons.map((emo) => (
                                <TouchableOpacity 
                                    key={emo} 
                                    onPress={() => setRating(emo)}
                                    style={[
                                        styles.emoticonButton,
                                        rating === emo && styles.selectedEmoticon // 선택된 이모티콘 스타일 적용
                                    ]}
                                >
                                    <Text style={styles.emoticon}>{emo}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>


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

      {/*화면의 아무 곳에나 날짜 선택기 모달 컴포넌트 추가 */}
      <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          confirmTextIOS="확인"
          cancelTextIOS="취소"
      />
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
  contentWrapper: { //실제 콘텐츠를 감싸는 래퍼
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
    aspectRatio: 1,
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
      ratingContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
        textAlign: 'center',
    },
    emoticonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    emoticonButton: {
        padding: 8,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'transparent', // 기본 테두리는 투명
    },
    selectedEmoticon: {
        borderColor: '#FF8C42', // 선택 시 테두리 색상
        backgroundColor: 'rgba(255, 140, 66, 0.1)',
    },
    emoticon: {
        fontSize: 32,
    },
});

export default DiaryEntryScreen;

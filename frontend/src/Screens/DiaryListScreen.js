import React, { useState, useEffect } from 'react';  // useState, useEffect 추가!
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUserState } from '../Contexts/UserContext';  // 유저 상태 가져오기
import { Ionicons } from '@expo/vector-icons'; // 아이콘 추가
import config from '../config';
import DiaryItem from '../Components/DiaryItem';

const DiaryListScreen = ({ route }) => {

  console.log("route.params 확인:", route.params);  // route.params 로그 찍기
  if (!route.params || !route.params.date) {
    return (
        <View style={styles.container}>
            <Text>날짜 정보가 없습니다. 다시 선택해주세요.</Text>
        </View>
    );
}
    const { date } = route.params;
    const navigation = useNavigation();
    const [diaryEntries, setDiaryEntries] = useState([]); // useState 추가
    const [user] = useUserState();  // 현재 로그인된 유저 가져오기

    console.log("👤 현재 로그인한 유저:", user); // 유저 데이터 로그 찍기
  
    const fetchDiaryEntries = async () => {
      try {

        if (!user?.id) {
          console.warn("userId가 없음! 로그인 확인 필요");
          return;
      }
        console.log(`${date}의 일기 데이터를 불러옵니다.`);
        const response = await axios.get(`${config.API_BASE_URL}/api/users/${user.id}/diaries`, {
            params: { date }  // 쿼리 파라미터로 날짜 전달
        });        
        
        console.log("가져온 일기 목록:", response.data);
        setDiaryEntries(response.data.data); // .data를 한 번 더 붙여서 배열을 꺼내온다.
        console.log("저장된 상태 확인:", diaryEntries); // 추가된 로그
      } catch (error) {
        console.error('일기 조회 오류:', error);
      }
    };
  

    useFocusEffect(
        React.useCallback(() => {
            console.log("DiaryListScreen이 포커스됨, 데이터를 새로고침합니다.");
            fetchDiaryEntries();
        }, [user, date]) // user나 date가 바뀐 경우에도 대응
    );


    //일기 수정, 삭제 처리
    // 기존 handleDelete 함수는 이제 이 함수로 통합
    const handleLongPress = (diary) => {
        Alert.alert(
            "일기 관리", // 제목
            "이 기록에 대해 무엇을 할까요? 🤔",
            [
                // 옵션 1: 수정하기
                {
                    text: "수정",
                    onPress: () => {
                        // DiaryEntryScreen으로 이동하며 수정할 diary 객체 전체를 전달
                        navigation.navigate('DiaryEntryScreen', { diaryToEdit: diary });
                    },
                },
                // 옵션 2: 삭제하기
                {
                    text: "삭제",
                    onPress: async () => {
                        try {
                            // 기존 handleDelete 함수의 핵심 로직이 여기로 옮겨진 것
                            await axios.delete(`${config.API_BASE_URL}/api/users/${user.id}/diaries/${diary.id}`);
                            // 목록 새로고침
                            fetchDiaryEntries();
                        } catch (error) {
                            console.error('일기 삭제 오류:', error);
                            Alert.alert("삭제 실패", "오류가 발생했습니다.");
                        }
                    },
                    style: "destructive",
                },
                // 옵션 3: 취소
                { text: "취소", style: "cancel" },
            ]
        );
    };


    return (
      <SafeAreaView style={styles.container}>
          {/* 날짜 띄우는 부분 */}
      <View style={styles.dateFloating}>
        <Ionicons name="calendar" size={20} color="#FF8C42" />
        <Text style={styles.dateText}>{date}의 음식 일기</Text>
      </View>
          {diaryEntries.length === 0 ? (
              <Text style={styles.emptyMessage}>🍽️ 아직 기록이 없어요!</Text>
          ) : (
              <FlatList
                  data={diaryEntries}
                  extraData={diaryEntries} // 상태 변경 감지
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                        <DiaryItem 
                            item={item} 
                            onLongPress={() => handleLongPress(item)} 
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
    
           {/* 새 일기 작성 버튼 */}
           <TouchableOpacity 
             style={styles.fabButton} 
             onPress={() => navigation.navigate('DiaryEntryScreen', { date })}
          >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FDF6EC',
//     paddingHorizontal: 16,
//     alignItems: 'center',
//   },
//   dateFloating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.91)', 
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     elevation: 5,
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#FF8C42',
//     marginLeft: 5,  // 아이콘과 간격
//   },
//   emptyMessage: {
//     fontSize: 16,
//     color: '#999',
//     marginTop: 20,
//   },
//   diaryItem: {
//     width: '100%',  // 부모 요소와 동일한 너비
//     flexDirection: 'row',
//     padding: 15,
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     flexDirection: 'column', //이미지+텍스트
//     alignItems: 'center',
//     paddingHorizontal: 20, // 좌우 여백 추가
// },
// diaryTitle: {
//   fontSize: 18,
//   fontWeight: 'bold',
//   color: '#000000', 
//   textAlign: 'center',
//   marginBottom: 15,
//   fontFamily: 'System', // 기본 폰트 사용 가능
// },
// diaryContent: {
//   fontSize: 16,
//   color: '#555',
//   textAlign: 'center',
//   lineHeight: 22,
//   marginTop: 15,
// },
//   image: {
//     width: '100%',
//     height: undefined,  // 고정 높이 제거
//     aspectRatio: 1,   
//     borderRadius: 10,
//     resizeMode: 'cover', 
// },
//   separator: {
//     height: 15, // 아이템 간격 추가
//   },
//   fabButton: {
//     width: 60,
//     height: 60,
//     backgroundColor: 'rgba(255, 140, 66, 0.85)',
//     borderRadius: 30,
//     position: 'absolute',
//     bottom: 30,
//     right: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },

//       itemHeader: {
//         width: '100%',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     dateText: { 
//         fontSize: 14, 
//         fontWeight: 'bold', 
//         color: '#888', 
//     },
//     ratingEmoji: {
//         fontSize: 20,
//     }
// });


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EC',
    },
    dateFloating: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.91)',
        borderRadius: 20,
        alignSelf: 'center', // 중앙 정렬
        marginTop: 10,
        marginBottom: 15,
        elevation: 5,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF8C42',
        marginLeft: 5,
    },
    emptyMessage: {
        flex: 1,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    separator: {
        height: 15,
    },
    fabButton: {
        width: 60,
        height: 60,
        backgroundColor: '#FF8C42',
        borderRadius: 30,
        position: 'absolute',
        bottom: 30,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default DiaryListScreen;

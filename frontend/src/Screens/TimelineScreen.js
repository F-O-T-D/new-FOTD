// screens/TodayTableScreen.js
import { React, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SectionList, Image, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useUserState } from '../Contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import config from '../config';
import { useFocusEffect } from '@react-navigation/native';

// 데이터를 날짜별로 그룹핑
const groupDiariesByDate = (diaries) => {
    const grouped = diaries.reduce((acc, diary) => {
        const date = diary.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(diary);
        return acc;
    }, {});

    // SectionList가 요구하는 형식으로 변환: [{ title: '날짜', data: [...] }, ...]
    return Object.keys(grouped).map(date => ({
        title: date,
        data: grouped[date],
    }));
};

const TodayTableScreen = () => {
    const navigation = useNavigation();
    const [sections, setSections] = useState([]);
    const [user] = useUserState();
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllDiaries = async () => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/users/${user.id}/diaries`);
            // 받아온 데이터를 그룹핑해서 state에 저장
            const groupedData = groupDiariesByDate(response.data.data);
            setSections(groupedData);
        } catch (error) {
            console.error('모든 일기 조회 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAllDiaries();
        }, [user])
    );

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
                            fetchAllDiaries();
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


    const renderDiaryItem = ({ item }) => (
        <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <View style={styles.diaryItem}>
                <View style={styles.itemHeader}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    {/* 평점(이모티콘)이 있으면 표시 */}
                    {item.rating && <Text style={styles.ratingEmoji}>{item.rating}</Text>}
                </View>
                <Text style={styles.diaryTitle}>{item.title || "제목 없음"}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                <Text style={styles.diaryContent}>{item.content}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="book-outline" size={24} color="#F97316" />
                <Text style={styles.headerTitle}>나의 식탁일지</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#FF8C42" style={{ marginTop: 50 }} />
            ) : sections.length === 0 ? (
                <Text style={styles.emptyMessage}>🍽️ 아직 기록이 없어요!</Text>
            ) : (
                // FlatList 대신 SectionList 사용
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderDiaryItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                    SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    // 페이지네이션 (더 수정해야함)
                    onEndReached={() => console.log("목록의 끝에 도달!")}
                    onEndReachedThreshold={0.5}
                />
            )}

            <TouchableOpacity
                style={styles.fabButton}
                onPress={() => {
                    const today = new Date().toISOString().split('T')[0];
                    navigation.navigate('DiaryEntryScreen', { date: today });
                }}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF6EC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginHorizontal: 20, marginTop: 10, marginBottom: 15, backgroundColor: '#FFFFFF', borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#F97316', marginLeft: 10 },
    emptyMessage: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 50 },
    sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', backgroundColor: '#FDF6EC', paddingVertical: 10, paddingHorizontal: 20 },
    diaryItem: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
    diaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    diaryContent: { fontSize: 16, color: '#555', lineHeight: 22, marginTop: 10 },
    image: { width: '100%', aspectRatio: 1.5, borderRadius: 10, resizeMode: 'cover' },
    itemSeparator: { height: 15 },
    sectionSeparator: { height: 10 },
    fabButton: { width: 60, height: 60, backgroundColor: '#FF8C42', borderRadius: 30, position: 'absolute', bottom: 30, right: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    itemHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateText: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#888', 
    },
    ratingEmoji: {
        fontSize: 20,
    }
});

export default TodayTableScreen;
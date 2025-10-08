import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// DiaryListScreen과 TodayTableScreen에서 공통으로 사용할 아이템 컴포넌트
const DiaryItem = ({ item, onLongPress, showDate = false }) => {
    return (
        <TouchableOpacity onLongPress={onLongPress}>
            <View style={styles.diaryItem}>
                <View style={styles.itemHeader}>
                    {/* 날짜 텍스트 스타일을 여기서는 조금 다르게 설정. */}
                    {showDate && <Text style={styles.headerDateText}>{item.date}</Text>}
                    {item.rating && <Text style={styles.ratingEmoji}>{item.rating}</Text>}
                </View>
                <Text style={styles.diaryTitle}>{item.title || "제목 없음"}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                <Text style={styles.diaryContent}>{item.content}</Text>
            </View>
        </TouchableOpacity>
    );
};

// DiaryListScreen의 스타일을 그대로 가져옴
const styles = StyleSheet.create({
    diaryItem: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    itemHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerDateText: { 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: '#888', 
    },
    ratingEmoji: {
        fontSize: 20,
    },
    diaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    diaryContent: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
        marginTop: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        resizeMode: 'cover',
        marginBottom: 10,
    },
});

export default DiaryItem;
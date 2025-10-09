import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { useNavigation } from '@react-navigation/native';
import { MapRoutes } from '../Navigations/Routes';

const List = ({ data, onDeleteItem, onUpdateStatus, activeTab }) => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateToMapList = (item) => {
    navigation.navigate(MapRoutes.LISTMAP, { item });
  };

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate(MapRoutes.LISTMAP, { item })}>
                    <View style={styles.itemContainer}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.address}>{item.address}</Text>
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            {/* 탭에 따라 다른 아이콘의 상태 변경 버튼을 보여줍니다. */}
                            {activeTab === 'WISHED' ? (
                                <TouchableOpacity onPress={() => onUpdateStatus(item, 'VISITED')} style={styles.iconButton}>
                                    <Ionicons name="checkmark-circle-outline" size={26} color="green" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => onUpdateStatus(item, 'WISHED')} style={styles.iconButton}>
                                    <Ionicons name="arrow-undo-circle-outline" size={26} color="orange" />
                                </TouchableOpacity>
                            )}

                            {/* 삭제 버튼은 항상 보이도록 수정합니다. */}
                            <TouchableOpacity onPress={() => onDeleteItem(item.id)} style={styles.iconButton}>
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 1,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
    },
    address: {
        fontSize: 13,
        color: 'gray',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 5,
        marginLeft: 10,
    },
});

export default List;

import React, { memo, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Animated, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { WHITE, PRIMARY, GRAY } from '../Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ListItem = memo(({ item, onDeleteItem, onPressItem }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Alert.alert(
      '가게 삭제',
      `'${item.name}'을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: () => onDeleteItem(item.id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      {/* 가게 리스트 터치 시 맵으로 이동 */}
      <TouchableOpacity
        style={styles.task}
        activeOpacity={0.7}
        onPress={onPressItem}
      >
        <Text style={styles.taskText}>{item.name}</Text>
      </TouchableOpacity>

      {/* 삭제 버튼 수정 */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MaterialCommunityIcons name="trash-can-outline" size={24} color={GRAY.DARK} />
      </TouchableOpacity>
    </Animated.View>
  );
});

ListItem.displayName = 'ListItem';

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginHorizontal: 15,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4, 
  },
  task: {
    flex: 1,
  },
  taskText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#F97316',
    letterSpacing: 0.5,
  },
  deleteButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListItem;

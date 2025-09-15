import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { useNavigation } from '@react-navigation/native';
import { MapRoutes } from '../Navigations/Routes';

const List = ({ data, onDeleteItem }) => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ListItem item={item} onDeleteItem={onDeleteItem} onPressItem={() => navigateToMapList(item)} />
        )}
        windowSize={2}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Animated.View>
  );
};

List.propTypes = {
  data: PropTypes.array.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  separator: {
    height: 12, // 리스트 아이템 사이의 여백 조정
  },
});

export default List;

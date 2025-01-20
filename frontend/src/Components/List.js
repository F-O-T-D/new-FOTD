import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { GRAY } from '../Colors';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { useNavigation } from '@react-navigation/native';
import { MapRoutes } from '../Navigations/Routes';

const Separator = () => {
  return <View style={styles.separator}></View>;
};

const List = ({ data, onDeleteItem }) => {
  const navigation = useNavigation(); // useNavigation 훅 사용

  const navigateToMapList = (item) => {
    navigation.navigate(MapRoutes.LISTMAP, { item });
  };

  return (
    <FlatList
      data={data}
      //keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigateToMapList(item)}>
          <ListItem item={item} onDeleteItem={onDeleteItem} />
        </TouchableOpacity>
      )}
      windowSize={2}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={View}
      ListHeaderComponentStyle={{ height: 10 }}
    />

  );
};

List.propTypes = {
  data: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: GRAY.LIGHT,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});

export default List;

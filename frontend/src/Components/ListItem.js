import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { WHITE, PRIMARY } from '../Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserState } from '../Contexts/UserContext';
import axios from 'axios';
import { Alert } from 'react-native';


const ListItem = memo(({ item, onDeleteItem }) => {
  const [user, setUser] = useUserState();

  const handingDelete = () => {
    Alert.alert(
      '가게 삭제',
      `'${item.name}'를/을 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: () => {
            onDeleteItem(item.storeId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.task}>
        <Text>{item.name}</Text>
      </View>
      <Pressable onPress={() => handingDelete(item)} hitSlop={10}>
        <MaterialCommunityIcons
          name="trash-can"
          size={20}
          color={PRIMARY.DEFAULT}
        />
      </Pressable>
    </View>
  );
});

ListItem.displayName = 'ListItem';

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: PRIMARY.DEFAULT,
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  task: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default ListItem;

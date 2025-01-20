import { Image, StyleSheet, Text, View } from 'react-native';
import { PRIMARY, BACKCARROT } from '../Colors';

const EmptyList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>가게를 추가해주세요</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKCARROT,
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    marginTop: 10,
    color: PRIMARY.DEFAULT,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default EmptyList;

import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {backgroundColor: '#c8ccd0', flex: 1},
  inputText: {
    backgroundColor: 'white',
    marginVertical: height / 70,
    padding: height / 50,
  },
});

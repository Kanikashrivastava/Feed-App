import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postBox: {
    backgroundColor: '#fff',
    flex: 1,
    marginBottom: height / 100,
  },
  postImage: {
    height: width * 0.5625,
    width: width / 1.03,
    margin: 5,
  },
  postCaption: {
    paddingHorizontal: width / 80,
    paddingVertical: height / 80,
  },
  backgroundVideo: {
    flex: 1,
    height: height / 1.5,
    width: width / 1.5,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

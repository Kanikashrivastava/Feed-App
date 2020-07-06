import {StyleSheet, Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c8ccd0',
    flex: 1,
    paddingHorizontal: width / 50,
    paddingVertical: width / 50,
    justifyContent: 'space-between',
  },
  inputContainer: {
    height: height / 7,
    backgroundColor: '#fff',
    marginHorizontal: width / 60,
    paddingHorizontal: width / 60,
    borderRadius: height / 50,
  },
  imageToUpload: {
    width: 0.5 * width,
    height: 0.3 * width,
    alignItems: 'flex-end',
  },
  lessOpacityBackground: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  imageBorder: {
    borderRadius: 10,
  },
  imageRemoveIcon: {
    width: width / 10,
    height: height / 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    paddingVertical: height * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf4fc',
    marginHorizontal: width * 0.01,
    paddingHorizontal: width * 0.05,
    justifyContent: 'space-around',
    borderRadius: width * 0.05,
  },
  submitButton: {
    paddingVertical: height * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c98f0',
    marginHorizontal: width * 0.01,
    paddingHorizontal: width * 0.05,
    justifyContent: 'space-around',
    borderRadius: width * 0.05,
  },
  submitButtonLabel: {
    color: '#eaf4fc',
  },
  imageText: {
    marginRight: width / 30,
    color: '#2c98f0',
  },
  actionField: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: width / 30,
    marginTop: height / 30,
  },
  videoUploadView: {
    width: width * 0.22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 15,
    height: width / 15,
    borderRadius: width / 30,
    backgroundColor: '#f4f4f4',
  },
  progressView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#e8ebf1',
  },
  videoView: {
    backgroundColor: '#fff',
    width: width * 0.83,
    justifyContent: 'space-between',
    paddingVertical: height / 200,
    marginHorizontal: width / 30,
    marginTop: height / 40,
    borderRadius: 6,
    ...Platform.select({
      android: {elevation: 5},
      ios: {
        shadowOffset: {width: 3, height: 3},
        shadowColor: 'black',
        shadowOpacity: 0.3,
      },
    }),
  },
  videoPadding: {
    paddingHorizontal: width / 30,
  },
  bottomContent: {
    width: width * 0.83,
    paddingHorizontal: width / 30,
    marginTop: height / 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

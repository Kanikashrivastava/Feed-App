import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CameraKitCamera} from 'react-native-camera-kit';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

const {width, height} = Dimensions.get('window');
const cameraOptions = {
  flashMode: 'auto', // on/off/auto(default)
  focusMode: 'on', // off/on(default)
  zoomMode: 'on', // off/on(default)
  ratioOverlay: '1:1', // optional, ratio overlay on the camera and crop the image seamlessly
  ratioOverlayColor: 'grey', // optional
};

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isCameraOpen: false,
      isCameraBack: true,
    };
    this.isCameraAuthorized = 0;
  }

  openImagePicker = () => {
    if (Platform.OS === 'android') {
      this.setState({isModalVisible: true});
    } else {
      this.openImagePickerForIos();
    }
  };

  openImagePickerForIos = () => {
    const {options} = this.props;
    this.closeCamera();
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        return;
      } else if (response.customButton) {
        return;
      } else {
        this.props.onImageSelect(response);
      }
    });
  };

  openImageLibrary = () => {
    const {options} = this.props;
    this.closeCamera();
    if (this.isCameraAuthorized === 1) {
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          return;
        } else if (response.error) {
          return;
        } else if (response.customButton) {
          return;
        } else {
          this.props.onImageSelect(response);
        }
      });
    } else {
      this.handleCameraPermission();
    }
  };

  handleCameraPermission = async () => {
    try {
      const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();
      this.isCameraAuthorized = isCameraAuthorized;
      if (isCameraAuthorized > 0) {
        this.openImagePicker();
      } else {
        await CameraKitCamera.requestDeviceCameraAuthorization();
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to open camera,try to give permissions from settings',
      );
    }
  };

  takePicture = async () => {
    try {
      if (this.camera) {
        const data = await this.camera.capture(false);
        data.fileName = data.name;
        this.setState({isModalVisible: false, isCameraOpen: false});
        this.props.onImageSelect(data);
      }
    } catch (error) {
      console.log('error in clicking', error);
    }
  };

  closeCamera = () => {
    this.setState({isModalVisible: false, isCameraOpen: false});
  };

  changeCamera = async () => {
    if (this.camera) {
      this.camera.changeCamera();
    }
  };
  render() {
    return (
      <Modal
        visible={this.state.isModalVisible}
        transparent={true}
        onRequestClose={this.closeCamera}>
        {this.state.isCameraOpen ? (
          <View style={styles.container}>
            <CameraKitCamera
              ref={(cam) => (this.camera = cam)}
              style={styles.camaraStyles}
              cameraOptions={cameraOptions}
            />
            <View style={styles.mainCamera}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => this.changeCamera()}>
                <FontAwesome
                  size={height / 30}
                  name={'refresh'}
                  color={'#fff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.takePicture.bind(this)}
                style={styles.capture}>
                <FontAwesome
                  size={height / 30}
                  name={'camera'}
                  color={'#fff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.closeCamera}
                style={styles.closeCameraButton}>
                <FontAwesome size={height / 30} name={'close'} color={'#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.cameraOptionContainer}>
            <View style={styles.cameraOptionSubView}>
              <Text style={styles.selectImageText}>{'Select Image'}</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => this.setState({isCameraOpen: true})}>
                <Text style={styles.actionText}>{'Take Photo'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={this.openImageLibrary}>
                <Text style={styles.actionText}>{'Choose From Library'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={this.closeCamera}>
                <Text style={styles.cancelText}>{'CANCEL'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCamera: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    width: width,
    backgroundColor: '#000',
    flexDirection: 'row',
    paddingHorizontal: width / 20,
    justifyContent: 'space-between',
  },
  camaraStyles: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cameraOptionSubView: {
    width: width / 1.2,
    backgroundColor: '#fff',
    padding: 20,
  },
  selectImageText: {
    fontSize: height / 45,
    color: '#000',
  },
  actionButton: {
    marginTop: height / 35,
    width: width / 1.4,
  },
  cancelButton: {
    marginTop: height / 35,
    width: width / 1.4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelText: {
    fontSize: height / 50,
    color: '#000',
  },
  actionText: {
    fontSize: height / 45,
    color: 'rgba(0,0,0,0.7)',
  },
  capture: {
    width: width / 5,
    paddingVertical: height / 100,
    position: 'absolute',
    left: width / 2 - width / 10,
    alignItems: 'center',
  },
  flipButton: {
    paddingVertical: height / 100,
    width: width / 5,
  },
  closeCameraButton: {
    width: width / 5,
    alignItems: 'flex-end',
  },
});

Camera.propTypes = {
  //action performed after selecting or capturing the image
  onImageSelect: PropTypes.func.isRequired,
  //set options for the image picker library,match with react-native-image-picker
  options: PropTypes.object,
  //set quality for the image captured
  quality: PropTypes.number,
};
Camera.defaultProps = {
  options: {},
  quality: 0.6,
  onImageSelect: (response) =>
    console.log('response on image select is', response),
};
export default Camera;

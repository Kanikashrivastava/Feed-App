import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import {styles} from './style';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Camera from '../Components/Camera';
const {width, height} = Dimensions.get('window');

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true,
  },
};
const videoOptions = {
  title: 'Video Picker',
  takePhotoButtonTitle: null,
  mediaType: 'video',
  videoQuality: 'medium',
  chooseFromLibraryButtonTitle: 'Choose from Library',
};
class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postDescription: '',
      selectedImagePath: null,
      selectedVideoPath: null,
      videoPaused: false,
    };
    this.cameraRef = React.createRef();
  }

  openImagePicker = async () => {
    if (this.state.selectedVideoPath !== null) {
      Alert.alert('Alert', 'You need to remove the video.');
      return;
    }
    if (this.cameraRef) {
      this.cameraRef.handleCameraPermission();
    }
  };

  validateTypeOfImage = (image) => {
    console.log(image);
    try {
      let response = image;
      if (image.type === null || image.type === undefined) {
        let type = image.fileName.split('.');
        type = type[type.length - 1].toLowerCase();
        response = {
          ...response,
          type: `image\/${type}`,
        };
      }
      return response;
    } catch (error) {
      return image;
    }
  };
  removeVideo = () => {
    console.log();
    this.setState({
      selectedVideoPath: null,
    });
  };

  openVideoPicker = () => {
    if (this.state.selectedImagePath !== null) {
      Alert.alert('information', 'You need to remove the image.');
      return;
    }

    ImagePicker.showImagePicker(videoOptions, (response) => {
      if (response.didCancel) {
        return;
      } else {
        this.setState({
          selectedVideoPath: response,
          selectedImagePath: null,
        });
      }
    });
  };

  getVideoName = () => {
    try {
      if (Platform.OS === 'android') {
        let path = this.state.selectedVideoPath.path;
        let nameArray = path.split('/');
        return nameArray[nameArray.length - 1];
      } else {
        return this.state.selectedVideoPath.fileName;
      }
    } catch (error) {
      return 'temp';
    }
  };

  onSubmit = async () => {
    try {
      const {
        selectedImagePath,
        postDescription,
        selectedVideoPath,
      } = this.state;
      let payload = {
        img: selectedImagePath,
        caption: postDescription,
        video: selectedVideoPath,
      };
      console.log(payload);
      let body = await AsyncStorage.getItem('@storage_Key');
      body = JSON.parse(body) || {
        jsonValue: [],
      };
      const jsonValue = JSON.stringify({
        jsonValue: [...body.jsonValue, payload],
      });
      await AsyncStorage.setItem('@storage_Key', jsonValue);
      this.props.navigation.navigate('Home');
    } catch (e) {
      console.log(e);
    }
  };

  renderVideo = () => {
    console.log(this.state.selectedVideoPath);
    try {
      return (
        <View style={styles.videoView}>
          <View style={styles.videoPadding}>
            <Text
              color={'#4f4f4f'}
              numberOfLines={1}
              style={styles.videoNameText}>
              {this.getVideoName()}
            </Text>
          </View>
          <View style={styles.bottomContent}>
            <View style={styles.videoUploadView}>
              <TouchableOpacity
                style={styles.videoButton}
                onPress={() =>
                  this.props.navigation.navigate('VideoPlayer', {
                    uri: this.state.selectedVideoPath.uri,
                  })
                }>
                <FontAwesome
                  size={height / 70}
                  name={'play'}
                  color={'#8b8fa5'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.videoButton}
                onPress={() => this.removeVideo()}>
                <FontAwesome
                  size={height / 60}
                  name={'close'}
                  color={'#8b8fa5'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } catch (error) {
      return null;
    }
  };

  render() {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.feedText}
                placeholder="Whats in your mind?"
                onChangeText={(postDescription) =>
                  this.setState({postDescription})
                }
                value={this.state.postDescription}
                multiline={true}
              />
            </View>
            <View style={styles.actionField}>
              <TouchableOpacity
                style={styles.action}
                onPress={this.openVideoPicker}>
                <Text style={styles.imageText} numberOfLines={1}>
                  {'Video'}
                </Text>
                <FontAwesome
                  name={'video-camera'}
                  size={height / 40}
                  color={'#2C98F0'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.action}
                onPress={this.openImagePicker}>
                <Text style={styles.imageText} numberOfLines={1}>
                  {'Image'}
                </Text>
                <FontAwesome
                  name={'image'}
                  size={height / 40}
                  color={'#2C98F0'}
                />
              </TouchableOpacity>
            </View>
            {this.state.selectedImagePath ? (
              <ImageBackground
                source={{uri: this.state.selectedImagePath.uri}}
                style={[styles.imageToUpload, {marginTop: height / 90}]}
                imageStyle={styles.imageBorder}
                resizeMode={'cover'}>
                <View
                  style={[
                    styles.imageToUpload,
                    styles.lessOpacityBackground,
                    styles.imageBorder,
                  ]}>
                  <TouchableOpacity
                    style={styles.imageRemoveIcon}
                    onPress={() => this.setState({selectedImagePath: null})}>
                    <FontAwesome
                      name={'window-close'}
                      size={width / 25}
                      color={'#fff'}
                    />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            ) : null}
            {this.state.selectedVideoPath && this.renderVideo()}
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.onSubmit()}>
            <Text style={styles.submitButtonLabel}>{'Submit'}</Text>
          </TouchableOpacity>
        </View>
        <Camera
          ref={(ref) => (this.cameraRef = ref)}
          options={options}
          onImageSelect={(response) => {
            response = this.validateTypeOfImage(response);
            this.setState({
              selectedImagePath: response,
              selectedVideoPath: null,
            });
          }}
        />
      </React.Fragment>
    );
  }
}

export default CreatePost;

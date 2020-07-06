/* eslint-disable no-bitwise */
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import ProgressBar from 'react-native-progress/Bar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {withNavigationFocus} from '@react-navigation/compat';

const {width} = Dimensions.get('window');
const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  videoCover: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  video: {
    width: '100%',
    height: width * 0.5625,
  },
  buffering: {
    backgroundColor: '#000',
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 48,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    zIndex: 20,
  },
  mainButton: {
    marginRight: 15,
  },
  duration: {
    color: '#FFF',
    marginLeft: 15,
  },
});

const secondsToTime = (time) => {
  return ~~(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + (time % 60);
};

class RNVideo extends Component {
  state = {
    error: false,
    buffering: true,
    animated: new Animated.Value(0),
    paused: true,
    progress: 0,
    duration: 0,
  };

  componentWillUnmount() {
    this.setState({paused: true});
  }
  handleError = (meta) => {
    const {
      error: {code},
    } = meta;
    let error = 'An error occured while playing the video.';
    switch (code) {
      case -11800:
        error = "Couldn't load video from url";
        break;
    }
    this.setState({error});
  };
  handleOnLoad = (meta) => {
    this.setState({duration: meta.duration});
  };
  handleOnEnd = () => {
    this.setState({paused: true});
  };
  handleOnProgress = (meta) => {
    this.setState((prevState) => {
      return {progress: meta.currentTime / prevState.duration};
    });
  };
  handleMainButtonTouch = () => {
    if (this.state.progress >= 0.9) {
      this.player.seek(0, 0);
    }
    this.setState((state) => {
      return {paused: !state.paused};
    });
  };
  handleLoadStart = () => {
    this.triggerBufferAnimation();
  };
  triggerBufferAnimation = () => {
    Animated.loop(
      Animated.timing(this.state.animated, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        isInteraction: false,
      }),
    ).start();
  };
  handleBuffer = (meta) => {
    meta.isBuffering && this.triggerBufferAnimation();
    if (!meta.isBuffering) {
      Animated.loop(
        Animated.timing(this.state.animated, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
          isInteraction: false,
        }),
      ).stop();
    }

    this.setState({
      buffering: meta.isBuffering,
    });
  };
  handleHideBuffer = () => {
    Animated.loop(
      Animated.timing(this.state.animated, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        isInteraction: false,
      }),
    ).stop();

    this.setState({
      buffering: false,
    });
  };
  handleProgressPress = (event) => {
    const position = event.nativeEvent.locationX;
    const progress = (position / 250) * this.state.duration;
    this.player.seek(progress);
  };
  render() {
    const {route} = this.props;
    const newUri = route?.params?.uri;
    const {uri} = this.props;

    const {error, buffering} = this.state;
    const interPolatedAnimation = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const rotateStyle = {
      transform: [{rotate: interPolatedAnimation}],
    };

    return (
      <View style={style.container}>
        <View style={buffering ? style.buffering : undefined}>
          <Video
            paused={this.state.paused}
            source={{uri: uri || newUri}}
            style={style.video}
            resizeMode="contain"
            onError={this.handleError}
            onLoad={this.handleOnLoad}
            onProgress={this.handleOnProgress}
            onLoadStart={this.handleLoadStart}
            onEnd={this.handleOnEnd}
            onBuffer={this.handleBuffer}
            progressUpdateInterval={50}
            onReadyForDisplay={this.handleHideBuffer}
            playInBackground={false}
            playWhenInactive={false}
            allowsExternalPlayback={false}
            ref={(ref) => {
              this.player = ref;
            }}
          />
          <View style={style.controls}>
            <TouchableWithoutFeedback onPress={this.handleMainButtonTouch}>
              <FontAwesome
                name={!this.state.paused ? 'pause' : 'play'}
                size={30}
                color="#fff"
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={this.handleProgressPress}>
              <View>
                <ProgressBar
                  progress={this.state.progress}
                  color="#fff"
                  unfilledColor="rgba(255, 255, 255, 0.5)"
                  borderColor="#fff"
                  width={250}
                  height={20}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text style={style.duration}>
              {secondsToTime(
                Math.floor(this.state.progress * this.state.duration),
              )}
            </Text>
          </View>
          <View style={style.videoCover}>
            {error && (
              <>
                <FontAwesome
                  name="exclamation-triangle"
                  size={30}
                  color="#f50404"
                />
                <Text>{error}</Text>
              </>
            )}

            {buffering && !error && (
              <Animated.View style={rotateStyle}>
                <FontAwesome name="circle-o-notch" size={30} color="#bbb" />
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
export const RNVideoComponent = withNavigationFocus(RNVideo);

import React, {Component} from 'react';
import {Text, View, Image, ScrollView} from 'react-native';
import {styles} from './styles';
import {RNVideoComponent} from '../Components/RNVideo';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoPaused: false,
      playStarted: false,
    };
  }

  render() {
    const {PostData} = this.props;
    return (
      <ScrollView>
        <View style={styles.container}>
          {PostData &&
            PostData.map((item, index) => (
              <View key={index} style={styles.postBox}>
                {item.caption ? (
                  <Text style={styles.postCaption}>{item.caption}</Text>
                ) : null}
                {item.img && (
                  <Image
                    source={{uri: item.img.uri}}
                    style={styles.postImage}
                  />
                )}
                {item.video && <RNVideoComponent uri={item.video.uri} />}
              </View>
            ))}
        </View>
      </ScrollView>
    );
  }
}

export default Posts;

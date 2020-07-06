import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Posts from '../Post/index';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './styles';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PostData: [],
    };
  }
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate() {
    this.getData();
  }
  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      let res = jsonValue != null ? JSON.parse(jsonValue) : null;
      this.setState({
        PostData: res.jsonValue,
      });
    } catch (e) {}
  };
  render() {
    return (
      <View style={styles.container}>
        <Text
          style={styles.inputText}
          onPress={() => this.props.navigation.navigate('CreatePost')}>
          {'Whats in your mind!'}
        </Text>
        <Posts PostData={this.state.PostData} />
      </View>
    );
  }
}

export default Home;

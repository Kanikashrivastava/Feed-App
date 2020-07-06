import React from 'react';
// Navigation Imports
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//Components
import Posts from './Post';
import CreatePost from './CreatePost';
import Home from './Home';
import {RNVideoComponent} from './Components/RNVideo';

const Stack = createStackNavigator();

const Navigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Back',
        gestureEnabled: true,
      }}
      headerMode="float">
      <Stack.Screen
        options={{
          title: 'Welcome!',
        }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{
          title: 'Posts',
        }}
        name="Posts"
        component={Posts}
      />
      <Stack.Screen
        options={{
          title: 'Create Post',
        }}
        name="CreatePost"
        component={CreatePost}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="VideoPlayer"
        component={RNVideoComponent}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const RegisterScreen = (props) => {
  return <Navigator />;
};

export default RegisterScreen;

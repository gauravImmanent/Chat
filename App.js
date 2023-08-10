//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';

import Login from './src/Screens/Login';
import Register from './src/Screens/Register';
import Profile from './src/Screens/Profile';
import ChatScreen from './src/Screens/ChatScreen';
import UserList from './src/Screens/UserList';
// create a component
const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
      
      
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
        <Stack.Screen name='Profile' component={Profile} options={{headerShown: false}}/>
        <Stack.Screen name='UserList' component={UserList} options={{headerShown: false}}/>
        <Stack.Screen name="Chat" component={ChatScreen} options={{headerShown: false}}/>
        
        
      </Stack.Navigator>
      <StatusBar barStyle='dark-content'
   backgroundColor="transparent"
   translucent={true}
/>
    </NavigationContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  
});

//make this component available to the app
export default App;

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useContext, useState } from 'react';
import Home from './Home';
import LoginScreen from './LoginScreen';
import RecoverPassword from './RecoverPassword';
import RegisterScreen from './RegisterScreen';
import { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;



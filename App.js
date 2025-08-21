import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import CreatePollScreen from './screens/CreatePollScreen';
import PollScreen from './screens/PollScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f5" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f0f2f5',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#1a1a1a',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="CreatePoll" 
            component={CreatePollScreen} 
            options={{ title: 'Create Poll' }}
          />
          <Stack.Screen 
            name="Poll" 
            component={PollScreen} 
            options={{ title: 'Live Poll' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

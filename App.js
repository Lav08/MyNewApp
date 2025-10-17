import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Frontend/Loginscreen';
import HomeScreen from './Frontend/Homescreen';
import ProfileScreen from './Frontend/ProfileScreen'; 
import RegisterScreen from './Frontend/RegisterScreen';
import ChatBotScreen from './Frontend/ChatBotScreen';
import HelpScreen from './Frontend/HelpScreen';
import JobHuntScreen from './Frontend/JobHuntScreen';
import CvCreatorScreen from './Frontend/CvCreatorScreen';
import CoverLetterScreen from './Frontend/CoverLetterScreen';
import ArchiveScreen from './Frontend/ArchiveScreen';
import CoverLetterArchiveScreen from './Frontend/CoverLetterArchiveScreen';
import JobDetailsScreen from './Frontend/JobDetailsScreen';




const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ChatBot" component={ChatBotScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="Jobs" component={JobHuntScreen} />
    <Stack.Screen name="Cv" component={CvCreatorScreen}/>
    <Stack.Screen name="Scrisoare" component={CoverLetterScreen}/>
    <Stack.Screen name="Archive" component={ArchiveScreen}/>
    <Stack.Screen name="ArchiveCL" component={CoverLetterArchiveScreen}/>
    <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Detalii job' }} />

  </Stack.Navigator>
</NavigationContainer>
 );
}
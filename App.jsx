// App.js

import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import './global.css';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import Heroicons
import {
  HomeIcon as HomeOutline,
  ArrowDownTrayIcon as WithdrawOutline,
  BanknotesIcon as TransactionOutline,
  UserIcon as ProfileOutline,
} from 'react-native-heroicons/outline';

import {
  HomeIcon as HomeSolid,
  ArrowDownTrayIcon as WithdrawSolid,
  BanknotesIcon as TransactionSolid,
  UserIcon as ProfileSolid,
} from 'react-native-heroicons/solid';
import ProfileScreen from './screens/ProfileScreen';
import ChangePassword from './screens/ChangePassword';
import ChangePin from './screens/ChangePin';
import ConfirmPin from './screens/ConfirmPin';
import Terms from './screens/Terms';
import AboutUs from './screens/AboutUs';
import Support from './screens/Support';

// Create Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Screens
function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

function WithdrawScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Withdraw Screen</Text>
    </View>
  );
}

function TransactionScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Transaction Screen</Text>
    </View>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ChangePin" component={ChangePin} />
      <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Support" component={Support} />
    </Stack.Navigator>
  );
}

// Tabs with Icons
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          switch (route.name) {
            case 'Home':
              return focused ? (
                <HomeSolid color={color} size={size} />
              ) : (
                <HomeOutline color={color} size={size} />
              );
            case 'Withdraw':
              return focused ? (
                <WithdrawSolid color={color} size={size} />
              ) : (
                <WithdrawOutline color={color} size={size} />
              );
            case 'Transaction':
              return focused ? (
                <TransactionSolid color={color} size={size} />
              ) : (
                <TransactionOutline color={color} size={size} />
              );
            case 'Profile':
              return focused ? (
                <ProfileSolid color={color} size={size} />
              ) : (
                <ProfileOutline color={color} size={size} />
              );
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Withdraw" component={WithdrawScreen} />
      <Tab.Screen name="Transaction" component={TransactionScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

// App Root
export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

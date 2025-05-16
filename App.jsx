import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeIcon,
  PlusIcon,
  Square3Stack3DIcon,
  UsersIcon,
} from 'react-native-heroicons/outline';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import FundScreen from './src/screens/FundScreen';
import TransactionScreen from './src/screens/TransactionScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import VerifyScreen from './src/screens/VerifyScreen';


// import ProfileScreen from './src/screens/ProfileScreen';
import ChangePassword from './src/screens/ChangePassword';
import ChangePin from './src/screens/ChangePin';
import ConfirmPin from './src/screens/ConfirmPin';
import Terms from './src/screens/Terms';
import AboutUs from './src/screens/AboutUs';
import Support from './src/screens/Support';



// Splash logo
import logo from './src/assets/images/1.png';
import './global.css';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const OtherStackWithTab = createNativeStackNavigator();

const OtherStackWithTabScreen = () => (
  <OtherStackWithTab.Navigator screenOptions={{ headerShown: false }}>
    <OtherStackWithTab.Screen name="Profile" component={ProfileScreen} />
    <OtherStackWithTab.Screen name="ChangePassword" component={ChangePassword} />
  </OtherStackWithTab.Navigator>
);
// 🧭 Bottom Tab Navigator (Dashboard)
const MyTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        let Icon;
        const iconProps = { color: focused ? '#000' : color, size: 30 };

        switch (route.name) {
          case 'Home':
            Icon = HomeIcon;
            break;
          case 'Fund':
            Icon = PlusIcon;
            break;
          case 'Transaction':
            Icon = Square3Stack3DIcon;
            break;
          case 'Profile':
            Icon = UsersIcon;
            break;
        }

        return (
          <View style={[styles.iconWrapper, focused ? styles.focusedIcon : null]}>
            <Icon {...iconProps} />
          </View>
        );
      },
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'black',
      tabBarLabelStyle: {
        fontWeight: 'bold',
      },
      tabBarStyle: [
        styles.tabBar,
        Platform.OS === 'android' && { height: 65 },
        Platform.OS === 'ios' && { height: 70 },
      ],
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Fund" component={FundScreen} />
    <Tab.Screen name="Transaction" component={TransactionScreen} />
    {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    <Tab.Screen
      name="Profile"
      component={OtherStackWithTabScreen}
      listeners={({ navigation, route }) => ({
        tabPress: e => {
          const state = navigation.getState();

          // Find the currently focused tab
          const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

          if (isFocused) {
            // Prevent default behavior
            e.preventDefault();

            // Reset the stack to ProfileMain
            navigation.navigate('Profile', {
              screen: 'Profile',
            });
          }
        },
      })}
    />


  </Tab.Navigator>
);

// 🧠 App Root
export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const userToken = await AsyncStorage.getItem('userToken');

        setIsFirstLaunch(hasLaunched === null);
        setIsAuthenticated(!!userToken);
      } catch (error) {
        console.error('App init error:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 2000); // Splash delay
      }
    };

    initializeApp();
  }, []);

  if (isLoading || isFirstLaunch === null) {
    return (
      <View style={styles.splashContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.splashText}>Cashpoint</Text>
      </View>
    );
  }

  const initialRoute = isFirstLaunch
    ? 'Onboarding'
    : isAuthenticated
    ? 'ChangePassword'
    : 'Login';
    // ? 'Login'
    // : 'Dashboard';

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={initialRoute}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />

          <Stack.Screen name="Dashboard" component={MyTabs} />


          {/* <Stack.Screen name="ChangePassword" component={ChangePassword} /> */}
          <Stack.Screen name="ChangePin" component={ChangePin} />
          <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          {/* <Stack.Screen name="Support" component={Support} /> */}


        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3C3ADD',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  splashText: {
    // marginTop: 5,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  iconWrapper: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  focusedIcon: {
    backgroundColor: '#D9D9D9',
  },
});



















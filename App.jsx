import {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, StatusBar, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import MoreServices from './src/screens/MoreServices';
import Airtime from './src/screens/Airtime';
import Data from './src/screens/Data';
import Electricity from './src/screens/Electricity';
import Cable from './src/screens/Cable';
import Swap from './src/screens/Swap';
import SaveEarn from './src/screens/SaveEarn';
import Education from './src/screens/Education';
import ConfirmAirtime from './src/screens/ConfirmAirtime';
import Pin from './src/screens/Pin';
import Receipt from './src/screens/Receipt';
import LockFunds from './src/screens/LockFunds';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ServicesStack = createNativeStackNavigator();

function ServicesNav() {
  return (
    <ServicesStack.Navigator screenOptions={{headerShown: false}}>
      <ServicesStack.Screen name="MoreServicesMain" component={MoreServices} />
      <ServicesStack.Screen name="BuyAirtime" component={Airtime} />
      <ServicesStack.Screen name="ConfirmAirtime" component={ConfirmAirtime} />
      <ServicesStack.Screen name="BuyData" component={Data} />
      <ServicesStack.Screen name="ElectricityBill" component={Electricity} />
      <ServicesStack.Screen name="CableTV" component={Cable} />
      <ServicesStack.Screen name="EducationPIN" component={Education} />
      <ServicesStack.Screen name="AirtimeSwap" component={Swap} />
      <ServicesStack.Screen name="SaveAndEarn" component={SaveEarn} />
    </ServicesStack.Navigator>
  );
}

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
      <Stack.Screen name="MoreServices" component={ServicesNav} />
    </Stack.Navigator>
  );
}
// 🧭 Bottom Tab Navigator (Dashboard)
const MyTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({focused, color}) => {
        let Icon;
        const iconProps = {color: focused ? '#000' : color, size: 30};

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
          <View
            style={[styles.iconWrapper, focused ? styles.focusedIcon : null]}>
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
        Platform.OS === 'android' && {height: 65},
        Platform.OS === 'ios' && {height: 70},
      ],
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Fund" component={FundScreen} />
    <Tab.Screen name="Transaction" component={TransactionScreen} />
    <Tab.Screen name="Profile" component={ProfileStack} />
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
          screenOptions={{headerShown: false}}
          initialRouteName={'MoreServices'}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="Dashboard" component={MyTabs} />
          <Stack.Screen name="ChangePin" component={ChangePin} />
          <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="MoreServices" component={ServicesNav} />
          <ServicesStack.Screen name="Pin" component={Pin} />
          <ServicesStack.Screen name="Receipt" component={Receipt} />
          <Stack.Screen name="LockFunds" component={LockFunds} />
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
    shadowOffset: {width: 0, height: 0},
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

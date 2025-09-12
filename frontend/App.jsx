// App.jsx
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground,
  AppState,
} from 'react-native';
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
import ChangePassword from './src/screens/ChangePassword';
import ChangePin from './src/screens/ChangePin';
import ConfirmPin from './src/screens/ConfirmPin';
import ForgotPassword from './src/screens/ForgotPassword';
import SellGiftCard from './src/screens/SellGiftCard';
import BuyGiftCard from './src/screens/BuyGiftCardScreen';
import SellCrypto from './src/screens/SellCrypto';
import BuyCrypto from './src/screens/BuyCrypto';
import RateCalculator from './src/screens/RateCalculator';
import TradeCrypto from './src/screens/TradeCrypto';
import FundWalletCrypto from './src/screens/FundWalletCrypto';
import CryptoHistory from './src/screens/CryptoHistory';
import CryptoDetails from './src/screens/CryptoDetails';
import UpgradeToTierTwoScreen from './src/screens/UpgradeToTierTwoScreen';
import UpgradeToTierThreeScreen from './src/screens/UpgradeToTierThreeScreen';
import KycStatus from './src/screens/KycStatus';
import Terms from './src/screens/Terms';
import AboutUs from './src/screens/AboutUs';
import Withdrawal from './src/screens/Withdrawal';
import VirtualAccountWithdrawal from './src/screens/VirtualAccountWithdrawal';
import CryptoWithdrawal from './src/screens/CryptoWithdrawal';
import WithdrawalHistory from './src/screens/WithdrawalHistory';
import Support from './src/screens/Support';
import Notification from './src/screens/NotificationScreen';
import ProfileUpdateScreen from './src/screens/ProfileUpdateScreen';

// Service Screens
import MoreServices from './src/screens/MoreServices';
import Airtime from './src/screens/Airtime';
import Data from './src/screens/Data';
import Electricity from './src/screens/Electricity';
import BettingPurchase from './src/screens/BettingPurchase';
import GiftUser from './src/screens/GiftUser';
import Cable from './src/screens/Cable';
import Swap from './src/screens/Swap';
import SaveEarn from './src/screens/SaveEarn';
import Education from './src/screens/Education';
import ConfirmAirtime from './src/screens/ConfirmAirtime';
import Pin from './src/screens/Pin';
import Receipt from './src/screens/Receipt';
import LockFunds from './src/screens/LockFunds';
import Notifications from './src/screens/Notifications';
import Referral from './src/screens/Referral';
import FundWallet from './src/screens/FundWallet';
import Transfer from './src/screens/Transfer';
import WalletReferral from './src/screens/WalletReferral';
import Leaderboard from './src/screens/Leaderboard';

// Assets
import logo from './src/assets/images/1.png';
import bgImage from './src/assets/images/3.png';
import './global.css';
import {AuthProvider} from './src/context/AuthContext';
import CreatePinScreen from './src/screens/CreatePin';

// Navigators
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
      <ServicesStack.Screen name="SellGiftCard" component={SellGiftCard} />
      <ServicesStack.Screen name="SellCrypto" component={SellCrypto} />
      <ServicesStack.Screen name="BuyCrypto" component={BuyCrypto} />
      <ServicesStack.Screen name="TradeCrypto" component={TradeCrypto} />
      <ServicesStack.Screen name="CryptoHistory" component={CryptoHistory} />
      <ServicesStack.Screen name="CryptoDetails" component={CryptoDetails} />
      <ServicesStack.Screen
        name="BettingPurchase"
        component={BettingPurchase}
      />
      <ServicesStack.Screen name="GiftUser" component={GiftUser} />
      <ServicesStack.Screen name="BuyGiftCard" component={BuyGiftCard} />
      <ServicesStack.Screen name="RateCalculator" component={RateCalculator} />

      <ServicesStack.Screen name="ChangePassword" component={ChangePassword} />
      <ServicesStack.Screen
        name="ProfileUpdateScreen"
        component={ProfileUpdateScreen}
      />
      <ServicesStack.Screen name="Terms" component={Terms} />
      <ServicesStack.Screen name="AboutUs" component={AboutUs} />
      <ServicesStack.Screen name="Support" component={Support} />
      <ServicesStack.Screen name="MoreServices" component={ServicesNav} />
    </ServicesStack.Navigator>
  );
}

const ProfileStackScreen = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    {/* <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="ProfileUpdateScreen" component={ProfileUpdateScreen} />
    <Stack.Screen name="Terms" component={Terms} />
    <Stack.Screen name="AboutUs" component={AboutUs} />
    <Stack.Screen name="Support" component={Support} />
    <Stack.Screen name="MoreServices" component={ServicesNav} /> */}
  </Stack.Navigator>
);

// Tab Navigation
const MyTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({focused, color}) => {
        let Icon;
        const iconProps = {color: focused ? '#000' : color, size: 24};
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
      tabBarLabelStyle: {fontWeight: 'bold'},
      tabBarStyle: [
        styles.tabBar,
        Platform.OS === 'android' && {height: 65},
        Platform.OS === 'ios' && {height: 70},
      ],
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Fund" component={FundWallet} />
    <Tab.Screen name="Transaction" component={TransactionScreen} />
    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      listeners={({navigation, route}) => ({
        tabPress: e => {
          const state = navigation.getState();
          const isFocused =
            state.index === state.routes.findIndex(r => r.key === route.key);
          if (isFocused) {
            e.preventDefault();
            navigation.navigate('Profile', {screen: 'Profile'});
          }
        },
      })}
    />
  </Tab.Navigator>
);

// App Root
export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldCheckAuth, setShouldCheckAuth] = useState(0);
  const appState = useRef(AppState.currentState);

  // Handle app state changes for auto logout
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      console.log(
        'App state changed from',
        appState.current,
        'to',
        nextAppState,
      );

      // App going to background - logout user
      if (
        appState.current.match(/active|foreground/) &&
        nextAppState === 'background'
      ) {
        console.log('App going to background - logging out user');
        await AsyncStorage.removeItem('auth_token');
      }

      // App coming to foreground - check auth status
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App coming to foreground - checking auth');
        setShouldCheckAuth(prev => prev + 1);
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const userToken = await AsyncStorage.getItem('auth_token');

        setIsFirstLaunch(hasLaunched === null);
        setIsAuthenticated(!!userToken);

        console.log('Auth check - Has launched:', hasLaunched !== null);
        console.log('Auth check - Token exists:', !!userToken);
      } catch (error) {
        console.error('App init error:', error);
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };

    initializeApp();
  }, [shouldCheckAuth]); // Re-run when shouldCheckAuth changes

  if (isLoading || isFirstLaunch === null) {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.splashText}>Cashpoint</Text>
        </View>
      </ImageBackground>
    );
  }

  const initialRoute = isFirstLaunch
    ? 'Onboarding'
    : isAuthenticated
    ? 'Dashboard'
    : 'Login';

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName={initialRoute}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
            <Stack.Screen name="CreatePin" component={CreatePinScreen} />

            <Stack.Screen name="Dashboard" component={MyTabs} />
            <Stack.Screen name="ChangePin" component={ChangePin} />
            <Stack.Screen name="ConfirmPin" component={ConfirmPin} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="MoreServices" component={ServicesNav} />
            <Stack.Screen name="Pin" component={Pin} />
            <Stack.Screen name="Receipt" component={Receipt} />
            <Stack.Screen name="LockFunds" component={LockFunds} />
            <Stack.Screen
              name="FundWalletCrypto"
              component={FundWalletCrypto}
            />
            <Stack.Screen name="KycStatus" component={KycStatus} />
            <Stack.Screen
              name="UpgradeToTierTwo"
              component={UpgradeToTierTwoScreen}
            />
            <Stack.Screen
              name="UpgradeToTierThree"
              component={UpgradeToTierThreeScreen}
            />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Referral" component={Referral} />
            <Stack.Screen name="Transfer" component={Transfer} />
            <Stack.Screen name="WalletReferral" component={WalletReferral} />
            <Stack.Screen name="Leaderboard" component={Leaderboard} />
            <Stack.Screen name="Withdrawal" component={Withdrawal} />
            <Stack.Screen
              name="VirtualAccountWithdrawal"
              component={VirtualAccountWithdrawal}
            />
            <Stack.Screen
              name="CryptoWithdrawal"
              component={CryptoWithdrawal}
            />
            <Stack.Screen
              name="WithdrawalHistory"
              component={WithdrawalHistory}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(60, 58, 221, 0.93)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  splashText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
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

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/apiServices'; // Adjust path as needed

// Import your image for the loading overlay
const loadingImage = require('../assets/images/1.png'); // Adjust path if necessary

const VerifyScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [email, setEmail] = useState(route.params?.email || ''); 
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes countdown
  const inputRefs = useRef([...Array(6)].map(() => React.createRef()));

  // Animated value for the zoom effect
  const zoomAnim = useRef(new Animated.Value(0)).current;

  // Effect to start/stop the animation when isVerifying changes
  useEffect(() => {
    if (isVerifying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(zoomAnim, {
            toValue: 1, // Zoom in
            duration: 1500, // Speed of zoom in (1.5 seconds)
            easing: Easing.inOut(Easing.ease), // Smooth easing
            useNativeDriver: true,
          }),
          Animated.timing(zoomAnim, {
            toValue: 0, // Zoom out
            duration: 1500, // Speed of zoom out (1.5 seconds)
            easing: Easing.inOut(Easing.ease), // Smooth easing
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      zoomAnim.stopAnimation();
      zoomAnim.setValue(0);
    }
  }, [isVerifying, zoomAnim]);

  // OTP Timer Logic
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      Alert.alert('OTP Expired', 'Your OTP has expired. Please resend a new one.');
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  // Fetch email if not present in route params (e.g., deep link or app resume)
  useEffect(() => {
    const fetchEmailFromStorage = async () => {
      if (!email) {
        try {
          const userData = await AsyncStorage.getItem('user_data');
          if (userData) {
            const user = JSON.parse(userData);
            setEmail(user.email);
          }
        } catch (e) {
          console.error('Failed to load email from storage:', e);
        }
      }
    };
    fetchEmailFromStorage();
  }, [email]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6 || otp.includes('')) {
      Alert.alert('Invalid OTP', 'Please enter a complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await authAPI.verifyOTP(fullOtp);

      if (result.success) {
        if (result.data.results && result.data.results.user) {
          await AsyncStorage.setItem('user_data', JSON.stringify(result.data.results.user));
        }

        Alert.alert('Success', result.data.message || 'Account verified successfully!');
        
        const currentUserData = result.data.results?.user || JSON.parse(await AsyncStorage.getItem('user_data'));
        
        // if (!currentUserData?.pin_set) {
        //   navigation.navigate('ChangePin');
        // } else {
          navigation.navigate('Dashboard');
        // }

      } else {
        Alert.alert('Verification Failed', result.error || 'The OTP entered is incorrect or expired.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Verification Failed', 'Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return; // Prevent resending if timer is still active

    setIsVerifying(true); // Use same loading state for resend action
    try {
      // CORRECTED: Use authAPI.resendOTP() instead of authAPI.sendOTP()
      const result = await authAPI.resendOTP(); 
      if (result.success) {
        Alert.alert('OTP Resent', result.data.message || `A new OTP has been sent to ${email}`);
        setOtp(['', '', '', '', '', '']); // Clear OTP input fields
        inputRefs.current[0].current.focus(); // Focus on first input
        setTimer(180); // Restart the timer
      } else {
        Alert.alert('Resend Failed', result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Resend Failed', 'Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Interpolate the animated value to a scale range
  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1], // Zooms from 100% to 110%
  });

  return (
    <SafeAreaView className="flex-1 bg-white pt-20">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 pt-8 px-6">
          <Text className="text-5xl font-bold text-black mb-10">Verification</Text>
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-800 mb-4">Confirm OTP</Text>
            <Text className="text-sm text-gray-700 mb-8">
              Enter the 6 digit OTP sent to your email:{' '}
              <Text style={{ color: '#3C3ADD', fontWeight: 'bold' }}>{email}</Text>
            </Text>
            {/* 6 Separate OTP Inputs */}
            <View className="flex-row justify-between mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs.current[index]}
                  className="w-14 h-14 border border-gray-300 rounded-xl text-center text-base"
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => {
                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);
                    if (value && index < 5) {
                      inputRefs.current[index + 1].current.focus();
                    } else if (value === '' && index > 0) {
                        inputRefs.current[index - 1].current.focus();
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                      inputRefs.current[index - 1].current.focus();
                    }
                  }}
                  editable={!isVerifying}
                />
              ))}
            </View>
          </View>
          {/* Resend & Timer */}
          <View className="flex-row justify-between items-center mb-10 px-3">
            <TouchableOpacity disabled={timer > 0 || isVerifying} onPress={handleResend}>
              <Text
                className={`text-sm font-semibold ${
                  timer > 0 || isVerifying ? 'text-gray-400' : 'text-blue-500'
                }`}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
            <Text className="text-lg text-black font-bold">{formatTime(timer)}</Text>
          </View>
        </View>
        {/* Bottom Section */}
        <View className="mt-auto px-6 pb-6">
          <TouchableOpacity
            className={`h-14 rounded-xl justify-center items-center ${
              isVerifying ? 'bg-gray-500' : 'bg-black'
            }`}
            onPress={handleVerify}
            disabled={isVerifying}
          >
            <Text className="text-white font-semibold text-base">
              {isVerifying ? 'Verifying...' : 'Click to Verify'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-6 items-center"
            onPress={() => navigation.navigate('Signup')}
            disabled={isVerifying}
          >
            <Text className="text-sm text-gray-700">
              Don’t have an account?{' '}
              <Text className="text-blue-500 font-medium">Register Here!</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Overlay Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isVerifying}
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 150,
    height: 150,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VerifyScreen;
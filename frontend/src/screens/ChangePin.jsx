import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/apiServices'; // Adjust path as needed

const loadingImage = require('../assets/images/1.png'); // Adjust path if necessary

const ChangePin = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // State to store the authenticated user's email

  const inputRefs = useRef([]);
  const zoomAnim = useRef(new Animated.Value(0)).current;

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = Array(6)
      .fill()
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

  // Animation effect for loading overlay
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(zoomAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(zoomAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      zoomAnim.stopAnimation();
      zoomAnim.setValue(0);
    }
  }, [isLoading, zoomAnim]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Fetch user email and send initial OTP on component mount
  useEffect(() => {
    const fetchUserEmailAndResendOtp = async () => { // Renamed function for clarity
      setIsLoading(true);
      try {
        const userDataString = await AsyncStorage.getItem('user_data');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const email = userData.email;
          setUserEmail(email);

          // NEW: Call resendOTP instead of sendOTP
          const otpResult = await authAPI.resendOTP();
          if (otpResult.success) {
            Alert.alert('Success', otpResult.data.message || 'OTP resent successfully to your email!');
          } else {
            Alert.alert('OTP Error', otpResult.error || 'Failed to resend OTP. Please try again.');
          }
        } else {
          Alert.alert('Error', 'User email not found. Please log in again.');
          navigation.navigate('Login'); // Redirect to login if user data is missing
        }
      } catch (error) {
        console.error('Error fetching user email or resending OTP:', error);
        Alert.alert('Error', 'Failed to initialize OTP process. Network error or invalid user data.');
        navigation.navigate('Login'); // Consider redirecting on critical error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEmailAndResendOtp();
  }, []); // Empty dependency array means this runs once on mount

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // Auto focus to next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      // Reset the OTP fields and timer
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      setTimer(180);
      setCanResend(false);

      const result = await authAPI.resendOTP(); // This is the same call as initial load now
      if (result.success) {
        Alert.alert('Success', result.data.message || 'OTP resent successfully!');
      } else {
        Alert.alert('Resend Failed', result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Network error while resending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authAPI.verifyOTP(otpValue);
      if (result.success) {
        Alert.alert('Success', result.data.message || 'OTP verified successfully!');
        navigation.navigate('ConfirmPin'); // Navigate to ConfirmPin as per your request
      } else {
        Alert.alert('Verification Failed', result.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      Alert.alert('Error', 'Network error during OTP verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Change PIN</Text>
        <View style={styles.otpContainer}>
          <Text style={styles.labelText}>Confirm OTP</Text>
          <Text style={styles.instructionText}>
            Enter the 6 digit OTP sent to your email:{' '}
            <Text style={styles.emailText}>{userEmail || 'Loading...'}</Text>
          </Text>
          <View style={styles.otpInputContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
                selectTextOnFocus
                editable={!isLoading} // Disable input during loading
              />
            ))}
          </View>
          <View style={styles.resendContainer}>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend || isLoading} // Disable during loading
              activeOpacity={0.7}
            >
              <Text
                style={
                  canResend && !isLoading
                    ? styles.resendActiveText
                    : styles.resendInactiveText
                }
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            otp.join('').length === 6 && !isLoading
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={handleContinue}
          disabled={otp.join('').length !== 6 || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  otpContainer: {
    marginTop: 32,
  },
  labelText: {
    fontSize: 16,
    color: '#333333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  emailText: {
    color: '#3B82F6',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendActiveText: {
    fontSize: 16,
    color: '#3B82F6',
  },
  resendInactiveText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#111827',
  },
  buttonInactive: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
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

export default ChangePin;
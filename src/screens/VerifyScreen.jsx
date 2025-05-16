import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

const VerifyScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes countdown

  const inputRefs = useRef([...Array(6)].map(() => React.createRef()));

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6 || otp.includes('')) {
      Alert.alert('Invalid OTP', 'OTP must be 6 digits');
      return;
    }

    setIsVerifying(true);
    try {
      // await api.verifyOtp(email, fullOtp);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Something went wrong');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    // Trigger resend OTP action
    Alert.alert('OTP Resent', `A new OTP has been sent to ${email}`);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0].current.focus();
    setTimer(180);
  };

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
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                      inputRefs.current[index - 1].current.focus();
                    }
                  }}
                />
              ))}
            </View>
          </View>

          {/* Resend & Timer */}
          <View className="flex-row justify-between items-center mb-10 px-3">
            <TouchableOpacity disabled={timer > 0} onPress={handleResend}>
              <Text
                className={`text-sm font-semibold ${
                  timer > 0 ? 'text-black' : 'text-blue-500'
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
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-sm text-gray-700">
              Don’t have an account?{' '}
              <Text className="text-blue-500 font-medium">Register Here!</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyScreen;

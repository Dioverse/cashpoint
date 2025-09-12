import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/apiServices'; // Adjust path as needed

// Import your image for the loading overlay
const loadingImage = require('../assets/images/1.png'); // Adjust path if necessary

const SignupScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Animated value for the zoom effect
  const zoomAnim = useRef(new Animated.Value(0)).current;

  // Effect to start/stop the animation when isLoading changes
  useEffect(() => {
    if (isLoading) {
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
  }, [isLoading, zoomAnim]);

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'Please enter your first name';
    if (!lastName.trim()) newErrors.lastName = 'Please enter your last name';

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^\d+$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must contain only digits';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      const userData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        middle_name: middleName.trim() || null,
        username: email.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        phone: phoneNumber.trim(),
        password,
      };

      // 1. Call Register API
      const registerResult = await authAPI.register(userData);

      if (registerResult.success) {
        const { token, user } = registerResult.data.results; 

        await AsyncStorage.setItem('auth_token', token);
        if (user) {
          await AsyncStorage.setItem('user_data', JSON.stringify(user));
        }

        // 2. Call OTP API after successful registration and token storage
        const otpResult = await authAPI.sendOTP({ email: email.toLowerCase().trim() });

        if (otpResult.success) {
          Alert.alert('Success', registerResult.data.message || 'Registration successful! OTP sent for verification.');
          // Navigate to Verify screen
          navigation.navigate('Verify', { email: email.toLowerCase().trim() });
        } else {
          // Handle OTP sending failure (e.g., show error but user is registered)
          Alert.alert('OTP Error', otpResult.error || 'Failed to send OTP. Please try again later.');
          // Optionally, navigate to a screen indicating registration but pending verification
          // navigation.navigate('Dashboard'); // Or a specific 'PendingVerification' screen
        }
      } else {
        // Handle Register API errors
        Alert.alert('Registration Failed', registerResult.error || 'Something went wrong during registration.');
        console.log(registerResult)
      }
    } catch (error) {
      console.error('Registration process error:', error);
      Alert.alert('Registration Failed', 'Network error or unexpected issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Interpolate the animated value to a scale range
  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1], // Zooms from 100% to 110%
  });

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 pt-20 px-6">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-5xl font-bold text-black mb-10">Register</Text>
            
            {/* First Name */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">First Name</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName) setErrors({ ...errors, firstName: null });
                }}
                editable={!isLoading}
              />
              {errors.firstName && (
                <Text className="text-red-500 mt-1 text-sm">{errors.firstName}</Text>
              )}
            </View>

            {/* Middle Name (Optional) */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">Middle Name (Optional)</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base border-gray-300`}
                placeholder="Enter your middle name"
                placeholderTextColor="#9CA3AF"
                value={middleName}
                onChangeText={(text) => setMiddleName(text)}
                editable={!isLoading}
              />
            </View>

            {/* Last Name */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">Last Name</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName) setErrors({ ...errors, lastName: null });
                }}
                editable={!isLoading}
              />
              {errors.lastName && (
                <Text className="text-red-500 mt-1 text-sm">{errors.lastName}</Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">Email Address</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                editable={!isLoading}
              />
              {errors.email && (
                <Text className="text-red-500 mt-1 text-sm">{errors.email}</Text>
              )}
            </View>

            {/* Phone Number */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">Phone Number</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                }}
                editable={!isLoading}
              />
              {errors.phoneNumber && (
                <Text className="text-red-500 mt-1 text-sm">{errors.phoneNumber}</Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">Password</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base text-black ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                editable={!isLoading}
              />
              {errors.password && (
                <Text className="text-red-500 mt-1 text-sm">{errors.password}</Text>
              )}
            </View>
          </ScrollView>

          {/* Register Button & Link to Login */}
          <View className="mt-auto pb-6">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isLoading ? 'bg-gray-500' : 'bg-black'
              }`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="mt-6 items-center"
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text className="text-sm text-gray-700">
                Already have an account?{' '}
                <Text className="text-blue-500 font-medium">Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

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
          <Text style={styles.loadingText}>Registering...</Text>
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

export default SignupScreen;
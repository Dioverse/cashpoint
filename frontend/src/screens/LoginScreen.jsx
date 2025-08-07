import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

// Import your image
const loadingImage = require('../assets/images/1.png'); // Adjust path if necessary

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    
    // Email validation
    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      // Call your Laravel API
      const result = await authAPI.login(email, password);

      if (result.success) {
        // CORRECTED: Access token and user from result.data.results
        const { token, user } = result.data.results; 

        // Store the token
        await AsyncStorage.setItem('auth_token', token);
        
        // Store user data if needed
        if (user) { // Check if user object exists
          await AsyncStorage.setItem('user_data', JSON.stringify(user));
        }

        // Handle remember me
        if (rememberMe) {
          await AsyncStorage.setItem('remember_email', email);
        } else {
          await AsyncStorage.removeItem('remember_email');
        }

        // Check if user needs to verify email/phone or create PIN
        // Assuming user object has these properties directly
        if (user?.email_verified_at === null) {
          const otpResult = await authAPI.sendOTP({ email: email.toLowerCase().trim() });
          if (otpResult.success) {
            Alert.alert('Success', otpResult.data.message || 'OTP sent successfully! Please verify your account.');
            // Navigate to Verify screen
            navigation.navigate('Verify', { email: email.toLowerCase().trim() });
          } else {
            // Handle OTP sending failure (e.g., show error but still logged in)
            Alert.alert('OTP Error', otpResult.error || 'Failed to send OTP. Please try again later.');
          }
          // Navigate to email verification
          navigation.navigate('Verify', { email: email.toLowerCase().trim() }); // Pass email to VerifyScreen
        } 
        // else if (!user?.pin_set) { // Assuming 'pin_set' is a boolean or similar
        //   // Navigate to create PIN
        //   navigation.navigate('ChangePin'); // Or 'CreatePin' if you have a dedicated screen
        // }
         else {
          // Navigate to main dashboard
          navigation.navigate('Dashboard');
        }

        // Alert.alert('Success', 'Login successful!'); // You might remove this if navigation is immediate
      } else {
        // Handle API errors
        Alert.alert('Login Failed', result.error);
        console.log(result)
      }
    } catch (error) {
      console.error('Login error:', error); // Log the full error for debugging
      Alert.alert('Login Failed', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const rememberedEmail = await AsyncStorage.getItem('remember_email');
        if (rememberedEmail) {
          setEmail(rememberedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered email:', error);
      }
    };

    loadRememberedEmail();
  }, []);

  // Interpolate the animated value to a scale range
  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1], // Zooms from 100% to 110%
  });

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 pt-10"
      >
        <View className="flex-1 pt-8 px-6">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-5xl font-bold text-black mb-10">Log In</Text>
            
            {/* Email Input */}
            <View className="mb-6 mt-6">
              <Text className="text-base font-medium text-gray-800 mb-4">
                Email Address
              </Text>
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
                  setEmail(text.toLowerCase().trim());
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                editable={!isLoading}
              />
              {errors.email && (
                <Text className="text-red-500 mt-1 text-sm">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6 mt-6">
              <Text className="text-base font-medium text-gray-800 mb-4">
                Password
              </Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: null });
                }}
                editable={!isLoading}
              />
              {errors.password && (
                <Text className="text-red-500 mt-1 text-sm">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Remember Me + Forgot Password */}
            <View className="flex-row justify-between items-center mt-2 px-2">
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
                disabled={isLoading}
              >
                <View
                  className={`w-5 h-5 rounded border mr-2 ${
                    rememberMe ? 'border-gray-400' : 'border-gray-400'
                  } justify-center items-center`}
                >
                  {rememberMe && (
                    <Icon name="check-box" size={15} color="black" />
                  )}
                </View>
                <Text className="text-sm text-gray-700">Remember me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={isLoading}
              >
                <Text className="text-sm text-blue-500 font-medium">
                  Forget password?
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Fixed bottom: Login button + Register */}
          <View className="mt-auto pb-6">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isLoading ? 'bg-gray-500' : 'bg-black'
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Login' : 'Login'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="mt-6 items-center"
              onPress={() => navigation.navigate('Signup')}
              disabled={isLoading}
            >
              <Text className="text-sm text-gray-700">
                Don't have an account?{' '}
                <Text className="text-blue-500 font-medium">Register Here!</Text>
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
          <Text style={styles.loadingText}>Logging in...</Text>
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

export default LoginScreen;
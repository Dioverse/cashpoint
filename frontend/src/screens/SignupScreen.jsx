import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Please enter your full name';
    if (!email) newErrors.email = 'Please enter your email';
    if (!phoneNumber) newErrors.phoneNumber = 'Please enter your phone number';
    if (!password) newErrors.password = 'Please enter your password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Normally you'd call an API here
      // await api.register({ fullName, email, phoneNumber, password });

      navigation.navigate('Verify', { email }); // Pass email to VerifyScreen
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Full Name */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">Full Name</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: null });
                }}
              />
              {errors.fullName && (
                <Text className="text-red-500 mt-1 text-sm">{errors.fullName}</Text>
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
              />
              {errors.phoneNumber && (
                <Text className="text-red-500 mt-1 text-sm">{errors.phoneNumber}</Text>
              )}
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-800 mb-4">Password</Text>
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
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
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
            >
              <Text className="text-sm text-gray-700">
                Already have an account?{' '}
                <Text className="text-blue-500 font-medium">Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

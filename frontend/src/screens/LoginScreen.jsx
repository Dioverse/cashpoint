import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Please enter your email';
    if (!password) newErrors.password = 'Please enter your password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // await api.login(email, password);
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
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
              >
                <View
                  className={`w-5 h-5 rounded border mr-2 ${
                    rememberMe ? 'border-gray-400' : 'border-gray-400'
                  } justify-center items-center`}
                >
                  {rememberMe && (
                    // <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>
                    <Icon name="check-box" size={15} color="black" />
                  )}
                </View>
                <Text className="text-sm text-gray-700">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
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
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-6 items-center"
              onPress={() => navigation.navigate('Signup')}
            >
              <Text className="text-sm text-gray-700">
                Don’t have an account?{' '}
                <Text className="text-blue-500 font-medium">Register Here!</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

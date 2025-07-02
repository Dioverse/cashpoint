import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ProfileUpdateScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
  const [username, setUsername] = useState('alexj');
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Please enter your full name';
    if (!email) newErrors.email = 'Please enter your email';
    if (!phoneNumber) newErrors.phoneNumber = 'Please enter your phone number';
    if (!username) newErrors.username = 'Please enter your username';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
  
    setIsUpdating(true);
    try {
      // Simulate update logic
      console.log({ fullName, email, phoneNumber, username });
  
      // Show success alert
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Profile'),
        },
      ]);
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="bg-[#4B39EF] px-5 pb-10 items-center justify-center">
          <View className="mt-20 items-center">
            <View className="flex-row items-center mb-2">
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                className="w-20 h-20 rounded-full mr-2"
              />
              <TouchableOpacity className="bg-black px-3 py-2 rounded-lg">
                <Text className="text-white text-xs font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-xl font-normal">
              Welcome, <Text className="font-bold">Alex!</Text>
            </Text>
          </View>
        </View>

        <View className="flex-1 pt-12 px-6 bg-white rounded-t-3xl -mt-6">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Full Name */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Full name</Text>
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

            {/* Phone Number */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Phone Number</Text>
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

            {/* Username */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Username</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your username"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
              />
              {errors.username && (
                <Text className="text-red-500 mt-1 text-sm">{errors.username}</Text>
              )}
            </View>

            {/* Email */}
            <View className="mb-6">
            <Text className="text-xl font-normal text-gray-800 mb-4">Email Address</Text>
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
          </ScrollView>

          {/* Update Button at Bottom */}
          <View className="mt-auto pb-6 mb-5">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isUpdating ? 'bg-gray-500' : 'bg-black'
              }`}
              onPress={handleUpdate}
              disabled={isUpdating}
            >
              <Text className="text-white font-semibold text-base">
                {isUpdating ? 'Updating...' : 'Update Details'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileUpdateScreen;

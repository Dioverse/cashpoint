import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import imageSrc from '../assets/images/2.png';
import { ArrowRightIcon } from 'react-native-heroicons/outline';

const screenHeight = Dimensions.get('window').height;

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      navigation.navigate('Login'); // Go to login screen
    } catch (error) {
      console.error('Error setting launch flag:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Image section (2/5 height) */}
      <View style={{ height: screenHeight * 0.45 }} className="justify-center items-center">
        <Image
          source={imageSrc}
          resizeMode="contain"
          className="w-4/5 h-full"
        />
      </View>

      {/* Text + Button section (3/5 height) */}
      <View className="flex-1 px-12 pt- items-center">
        <View>
            <Text className="text-5xl text-left font-bold text-black mb-4">
            Your One-Stop 
            </Text>
            <Text className="text-5xl text-left font-bold text-black mb-4">
            Solution Hub!
            </Text>
        </View>
        

        <Text className="text-base text-[#ACB4BE] leading-relaxed mb-5 px-6">
          Discover a world of convenience and ease with CASHPOINT, your ultimate lifestyle companion. Our innovative app offers a unique blend of features to simplify your daily life: VTU Solutions, Instant crypto to Naira conversions, and Gift card sales.
        </Text>
        

        <TouchableOpacity
        className="bg-transparent px-6 py-4 rounded-lg w-full mt-auto mb-12"
        onPress={handleGetStarted}
        >
            <View className="flex-row items-center justify-start">
                <Text className="text-[#3C3ADD] font-bold text-base mr-4">
                    Get Started
                </Text>
                <View className="bg-[#3C3ADD] rounded-full font-bold p-2 shadow-xl" style={styles.iconContainer}>
                    <ArrowRightIcon size={18} color="white" />
                </View>
            </View>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    iconContainer: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 7, // For Android
    },
  });


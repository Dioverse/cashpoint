import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SellGiftCard = () => {
  const navigation = useNavigation();
  const [giftCard, setGiftCard] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!giftCard) newErrors.giftCard = 'Please select a gift card';
    if (!category) newErrors.category = 'Please enter a category';
    if (!amount) newErrors.amount = 'Please enter an amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log({ giftCard, category, amount, image });

      Alert.alert('Success', 'Gift card submitted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Submission Failed', error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-[#4B39EF] px-5 pb-6 pt-16 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 items-center -ml-6">
            <Text className="text-white text-xl font-semibold">Sell Gift Card</Text>
          </View>
        </View>

        <View className="flex-1 pt-10 px-6 bg-white rounded-t-3xl -mt-6">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Gift Card */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Gift Card</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.giftCard ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Select gift card"
                placeholderTextColor="#9CA3AF"
                value={giftCard}
                onChangeText={(text) => {
                  setGiftCard(text);
                  if (errors.giftCard) setErrors({ ...errors, giftCard: null });
                }}
              />
              {errors.giftCard && (
                <Text className="text-red-500 mt-1 text-sm">{errors.giftCard}</Text>
              )}
            </View>

            {/* Category */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Category</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter category"
                placeholderTextColor="#9CA3AF"
                value={category}
                onChangeText={(text) => {
                  setCategory(text);
                  if (errors.category) setErrors({ ...errors, category: null });
                }}
              />
              {errors.category && (
                <Text className="text-red-500 mt-1 text-sm">{errors.category}</Text>
              )}
            </View>

            {/* Amount */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Amount</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
              />
              {errors.amount && (
                <Text className="text-red-500 mt-1 text-sm">{errors.amount}</Text>
              )}
            </View>

            {/* You're Getting */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">You’re Getting</Text>
              <View className="h-14 border border-gray-300 rounded-xl px-4 justify-center">
                <Text className="text-base text-gray-700">
                  ${amount ? (Number(amount) * 0.8).toFixed(2) : '0.00'}
                </Text>
              </View>
            </View>

            {/* Upload Gift Card Image */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Upload Gift Card Image(s)</Text>
              <TouchableOpacity
                className="h-14 border border-dashed border-gray-400 rounded-xl px-4 justify-center items-center"
                onPress={() => Alert.alert('Upload', 'Image upload coming soon')}
              >
                <Text className="text-base text-gray-500">Tap to upload</Text>
              </TouchableOpacity>
              {image && (
                <Image
                  source={{ uri: image }}
                  className="mt-4 w-full h-40 rounded-lg"
                  resizeMode="cover"
                />
              )}
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View className="pb-6 mb-5">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isSubmitting ? 'bg-gray-500' : 'bg-black'
              }`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="text-white font-semibold text-base">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SellGiftCard;

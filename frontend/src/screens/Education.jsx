import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon, ChevronDownIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Education = () => {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('₦ 2,500');
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Provider options
  const providers = ['WAEC', 'JAMB', 'NECO', 'NABTEB'];

  // Type options
  const types = ['Registration PIN', 'Result Checker', 'Direct Entry'];

  // Calculate amount based on provider, type, and quantity
  useEffect(() => {
    if (selectedProvider && selectedType && quantity) {
      const basePrice = 25; // Example base price per unit
      const calculatedAmount = parseInt(quantity) * basePrice;
      if (!isNaN(calculatedAmount)) {
        setAmount(`₦ ${calculatedAmount.toLocaleString()}`);
      }
    }
  }, [selectedProvider, selectedType, quantity]);

  const handleProceed = () => {
    if (selectedProvider && selectedType && quantity) {
      navigation.navigate('Pin', {
        provider: selectedProvider,
        type: selectedType,
        quantity,
        amount: amount.replace('₦ ', ''),
        transactionType: 'Education PIN Purchase',
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Education PIN</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-10">
        {/* Provider Selection */}
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-6">
          <Text className="text-gray-800 font-medium mb-2">
            Select Provider
          </Text>
          <TouchableOpacity
            className="h-14 bg-white rounded-lg px-4 flex-row justify-between items-center"
            onPress={() => {
              setShowProviderDropdown(!showProviderDropdown);
              setShowTypeDropdown(false);
            }}>
            <Text
              className={`${
                selectedProvider ? 'text-black' : 'text-gray-400'
              }`}>
              {selectedProvider || 'Select a provider'}
            </Text>
            <ChevronDownIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Provider Dropdown */}
          {showProviderDropdown && (
            <View className="bg-white mt-2 rounded-lg border border-gray-200 overflow-hidden z-10">
              {providers.map((provider, index) => (
                <TouchableOpacity
                  key={index}
                  className="py-3 px-4 border-b border-gray-100"
                  onPress={() => {
                    setSelectedProvider(provider);
                    setShowProviderDropdown(false);
                  }}>
                  <Text>{provider}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Type Selection */}
        <View className="mb-6">
          <Text className="text-gray-800 font-medium mb-2">Type</Text>
          <TouchableOpacity
            className="h-14 bg-white border border-gray-200 rounded-lg px-4 flex-row justify-between items-center"
            onPress={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowProviderDropdown(false);
            }}>
            <Text
              className={`${selectedType ? 'text-black' : 'text-gray-400'}`}>
              {selectedType || 'Select type'}
            </Text>
            <ChevronDownIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Type Dropdown */}
          {showTypeDropdown && (
            <View className="bg-white mt-2 rounded-lg border border-gray-200 overflow-hidden z-10">
              {types.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  className="py-3 px-4 border-b border-gray-100"
                  onPress={() => {
                    setSelectedType(type);
                    setShowTypeDropdown(false);
                  }}>
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quantity Input */}
        <View className="mb-6">
          <Text className="text-gray-800 font-medium mb-2">Quantity</Text>
          <TextInput
            className="h-14 bg-white border border-gray-200 rounded-lg px-4"
            placeholder="100"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        {/* Amount Display */}
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8">
          <Text className="text-gray-800 font-medium mb-2">Amount</Text>
          <View className="bg-white h-14 rounded-lg flex items-center justify-center">
            <Text className="text-xl font-semibold">{amount}</Text>
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            selectedProvider && selectedType && quantity
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleProceed}
          disabled={!selectedProvider || !selectedType || !quantity}>
          <Text className="text-white font-semibold text-base">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Education;

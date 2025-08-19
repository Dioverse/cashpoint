import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock vtuAPI calls - replace these with your actual api calls!
const vtuAPI = {
  verifyBillNo: async ({ billersCode, serviceID, type }) => {
    // Example fetch call - replace with your real implementation
    const res = await fetch('https://yourapi.com/vtu/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billersCode, serviceID, type }),
    });
    if (!res.ok) throw new Error('Verification failed');
    const data = await res.json();
    return { success: data.status, data: data.results.data };
  },

  buyBill: async ({ serviceId, billersCode, variationCode, amount, phone }) => {
    const res = await fetch('https://yourapi.com/vtu/bill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, billersCode, variationCode, amount, phone }),
    });
    const data = await res.json();
    return res.ok
      ? { success: true, data }
      : { success: false, error: data.message || 'Payment failed' };
  },
};

const Electricity = () => {
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [validatedUser, setValidatedUser] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [variationCode, setVariationCode] = useState('prepaid'); // toggle if needed
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Providers (ids must match backend serviceId)
  const providers = [
    { id: 'ikedc', name: 'IKEDC', icon: require('../assets/images/ikedc.png') },
    { id: 'ekedc', name: 'EKEDC', icon: require('../assets/images/ekedc.png') },
    { id: 'ibedc', name: 'IBEDC', icon: require('../assets/images/ibedc.png') },
    { id: 'jedc', name: 'JEDC', icon: require('../assets/images/jedc.png') },
    { id: 'aedc', name: 'AEDC', icon: require('../assets/images/aedc.png') },
  ];

  const amounts = [
    { value: 500, display: '₦ 500' },
    { value: 1000, display: '₦ 1,000' },
    { value: 1500, display: '₦ 1,500' },
    { value: 2000, display: '₦ 2,000' },
    { value: 2500, display: '₦ 2,500' },
    { value: 3000, display: '₦ 3,000' },
    { value: 3500, display: '₦ 3,500' },
    { value: 4000, display: '₦ 4,000' },
    { value: 5000, display: '₦ 5,000' },
  ];

  // Recent meter numbers for quick select
  const recentMeters = [
    { number: '11111111111', provider: 'ikedc' },
    { number: '11111111111', provider: 'ekedc' },
    { number: '11111111111', provider: 'ikedc' },
    { number: '11111111111', provider: 'aedc' },
  ];

  // Validate meter number with backend
  const handleValidate = async () => {
    if (!meterNumber || !selectedProvider) return;

    setIsValidating(true);
    setValidationError(null);
    setValidatedUser('');

    try {
      const response = await vtuAPI.verifyBillNo({
        billersCode: meterNumber,
        serviceID: selectedProvider,
        type: variationCode,
      });

      if (response.success) {
        // Assuming customer name is in response.data.content.customerName, else adjust accordingly
        const customerName = response.data?.content?.customerName || 'Verified User';
        setValidatedUser(customerName);
      } else {
        setValidationError('Validation failed. Please check meter number and provider.');
      }
    } catch (error) {
      setValidationError('An error occurred during validation.');
    } finally {
      setIsValidating(false);
    }
  };

  // Proceed to pay the bill
  const handleProceed = async () => {
    if (!phoneNumber || !selectedProvider || !selectedAmount || !meterNumber) return;

    if (!validatedUser) {
      Alert.alert('Validation Required', 'Please validate the meter number before proceeding.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const response = await vtuAPI.buyBill({
        serviceId: selectedProvider,
        billersCode: meterNumber,
        variationCode,
        amount: selectedAmount,
        phone: phoneNumber,
      });

      if (response.success) {
        Alert.alert('Success', 'Payment successful!');
        // Optionally reset form or navigate
        navigation.navigate('Pin', {
          phoneNumber,
          provider: selectedProvider,
          amount: selectedAmount,
          meterNumber,
          customerName: validatedUser,
          transactionType: 'Electricity Bill Payment',
        });
      } else {
        Alert.alert('Payment Failed', response.error || 'Unknown error occurred.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing payment.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getProviderIcon = (providerId) => {
    return providers.find((p) => p.id === providerId)?.icon;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Electricity Purchase
        </Text>
      </View>

      {/* Recent Meters */}
      <View className="px-7 mb-4 flex flex-row gap-x-4 mx-auto">
        {recentMeters.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center mr-4"
            onPress={() => {
              setMeterNumber(item.number);
              setSelectedProvider(item.provider);
              setValidatedUser('');
              setValidationError(null);
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image source={getProviderIcon(item.provider)} className="w-8 h-8" />
            </View>
            <Text className="text-white text-xs">{item.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
        {/* Phone Number Input */}
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-6">
          <Text className="text-gray-800 font-medium mb-2">Phone Number</Text>
          <TextInput
            className="h-12 bg-white rounded-lg px-4"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Provider Selection */}
        <Text className="text-gray-800 font-medium mb-3">Select Provider</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {providers.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              className={`w-[18%] h-20 items-center justify-center rounded-lg bg-[#3C3ADD21] mb-2 ${
                selectedProvider === provider.id ? 'border-2 border-[#4B39EF]' : ''
              }`}
              onPress={() => {
                setSelectedProvider(provider.id);
                setValidatedUser('');
                setValidationError(null);
              }}
            >
              <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                <Image source={provider.icon} className="w-8 h-8" />
              </View>
              <Text className="text-xs font-medium">{provider.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Variation code toggle (prepaid/postpaid) */}
        <View className="mb-6 flex-row justify-center gap-x-4">
          {['prepaid', 'postpaid'].map((type) => (
            <TouchableOpacity
              key={type}
              className={`px-4 py-2 rounded-lg ${
                variationCode === type ? 'bg-[#4B39EF]' : 'bg-gray-200'
              }`}
              onPress={() => setVariationCode(type)}
            >
              <Text
                className={`font-medium ${
                  variationCode === type ? 'text-white' : 'text-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meter Number with Validation */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-800 font-medium">Meter Number</Text>
            <TouchableOpacity
              className={`px-4 py-1 rounded-lg items-center justify-center ${
                meterNumber && selectedProvider && !isValidating
                  ? 'bg-black'
                  : 'bg-gray-400'
              }`}
              onPress={handleValidate}
              disabled={!meterNumber || !selectedProvider || isValidating}
            >
              {isValidating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-medium">Validate</Text>
              )}
            </TouchableOpacity>
          </View>
          <TextInput
            className="h-12 bg-white border border-gray-200 rounded-lg px-4"
            placeholder="Enter IUC Number"
            keyboardType="numeric"
            value={meterNumber}
            onChangeText={(text) => {
              setMeterNumber(text);
              setValidatedUser('');
              setValidationError(null);
            }}
          />
          {validatedUser ? (
            <Text className="text-right text-gray-600 mt-1">{validatedUser}</Text>
          ) : validationError ? (
            <Text className="text-right text-red-600 mt-1">{validationError}</Text>
          ) : null}
        </View>

        {/* Amount Selection */}
        <Text className="text-gray-800 font-medium mb-3">Select an Amount</Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8">
          <View className="flex-row flex-wrap justify-between">
            {amounts.map((amount, index) => (
              <TouchableOpacity
                key={index}
                className={`w-[18%] aspect-square items-center justify-center rounded-lg mb-2 ${
                  selectedAmount === amount.value ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedAmount(amount.value)}
              >
                <Text
                  className={`font-medium text-center ${
                    selectedAmount === amount.value ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {amount.display}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            phoneNumber && selectedProvider && selectedAmount && meterNumber
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleProceed}
          disabled={
            !phoneNumber || !selectedProvider || !selectedAmount || !meterNumber || isProcessingPayment
          }
        >
          {isProcessingPayment ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-semibold text-base">Proceed</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Electricity;

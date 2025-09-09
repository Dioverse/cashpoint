import { useState, useEffect } from 'react';
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
import { vtuAPI } from '../services/apiServices'; // Your actual API service

const Electricity = () => {
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [validatedUser, setValidatedUser] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [variationCode, setVariationCode] = useState('prepaid');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [providersError, setProvidersError] = useState(null);

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

  const recentMeters = [
    // You can consider populating this dynamically or keep static for now
    { number: '11111111111', providerServiceID: 'ikeja-electric' },
    { number: '11111111111', providerServiceID: 'eko-electric' },
    { number: '11111111111', providerServiceID: 'abuja-electric' },
    { number: '11111111111', providerServiceID: 'kaduna-electric' },
  ];

  // Fetch providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingProviders(true);
      setProvidersError(null);
      try {
        const res = await vtuAPI.getBills();
        if (res.success && res.data?.results?.data) {
          setProviders(res.data.results.data.filter(p => p.is_active === 1));
        } else {
          setProvidersError('Failed to load providers.');
        }
      } catch {
        setProvidersError('Failed to load providers.');
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, []);

  const handleValidate = async () => {
    if (!meterNumber || !selectedProvider) return;

    setIsValidating(true);
    setValidationError(null);
    setValidatedUser('');
    // console.log(meterNumber)
    // console.log(selectedProvider)
    // console.log(variationCode)

    try {
      const res = await vtuAPI.verifyBillNo({
        billersCode: meterNumber,
        serviceID: selectedProvider,
        type: variationCode,
      });

      if (res.success) {
        console.log(res)
        const customerName = res.data?.results?.data?.content?.Customer_Name || 'Verified User';


        setValidatedUser(customerName);
      } else {
        setValidationError(res.error || 'Validation failed. Please check meter number and provider.');
      }
    } catch {
      setValidationError('An error occurred during validation.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceed = async () => {
    if (!phoneNumber || !selectedProvider || !selectedAmount || !meterNumber) return;

    if (!validatedUser) {
      Alert.alert('Validation Required', 'Please validate the meter number before proceeding.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const res = await vtuAPI.buyBill({
        serviceId: selectedProvider,
        billersCode: meterNumber,
        variationCode,
        amount: selectedAmount,
        phone: phoneNumber,
      });

      if (res.success) {
        Alert.alert('Success', 'Payment successful!');
        navigation.navigate('Pin', {
          phoneNumber,
          provider: selectedProvider,
          amount: selectedAmount,
          meterNumber,
          customerName: validatedUser,
          transactionType: 'Electricity Bill Payment',
        });
      } else {
        Alert.alert('Payment Failed', res.error || 'Unknown error occurred.');
      }
    } catch {
      Alert.alert('Error', 'An error occurred while processing payment.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Find provider icon based on identifier, fallback to default icon if needed
  const getProviderIcon = (identifier) => {
    // Map your assets here or return a placeholder
    switch (identifier) {
      case 'IKEDC':
        return require('../assets/images/ikedc.png');
      case 'EKEDC':
        return require('../assets/images/ekedc.png');
      case 'IBEDC':
        return require('../assets/images/ibedc.png');
      case 'AEDC':
        return require('../assets/images/ekedc.png');
      case 'EEDC':
        return require('../assets/images/ekedc.png');
      default:
        return require('../assets/images/ekedc.png'); // fallback image
    }
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
        <Text className="text-white text-lg font-semibold">Electricity Purchase</Text>
      </View>

      {/* Recent Meters */}
      <View className="px-7 mb-4 flex flex-row gap-x-4 mx-auto">
        {recentMeters.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center mr-4"
            onPress={() => {
              setMeterNumber(item.number);
              setSelectedProvider(item.providerServiceID);
              setValidatedUser('');
              setValidationError(null);
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image source={getProviderIcon(providers.find(p => p.serviceID === item.providerServiceID)?.identifier)} className="w-8 h-8" />
            </View>
            <Text className="text-white text-xs">{item.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
        {/* Show loading or error for providers */}
        {loadingProviders ? (
          <ActivityIndicator size="large" color="#4B39EF" className="mb-4" />
        ) : providersError ? (
          <Text className="text-red-600 mb-4">{providersError}</Text>
        ) : (
          <>
            {/* Phone Number Input */}
            <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-6">
              <Text className="text-gray-800 font-medium mb-2">Phone Number</Text>
              <TextInput
                className="h-12 bg-white rounded-lg px-4"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={11}
              />
            </View>

            {/* Provider Selection */}
            <Text className="text-gray-800 font-medium mb-3">Select Provider</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              {providers.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  className={`w-[18%] h-20 items-center justify-center rounded-lg bg-[#3C3ADD21] mb-2 ${
                    selectedProvider === provider.serviceID ? 'border-2 border-[#4B39EF]' : ''
                  }`}
                  onPress={() => {
                    setSelectedProvider(provider.serviceID);
                    setValidatedUser('');
                    setValidationError(null);
                  }}
                >
                  <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                    <Image source={getProviderIcon(provider.identifier)} className="w-8 h-8" />
                  </View>
                  <Text className="text-xs font-medium">{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Variation code toggle */}
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
                placeholder="Meter Number"
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Electricity;

import React, { useEffect, useState } from 'react';
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
import { vtuAPI } from '../services/apiServices';

// Replace with your actual local images or fallback URLs
const cableIcons = {
  1: require('../assets/images/dstv.png'),
  2: require('../assets/images/gotv.png'),
  3: require('../assets/images/startimes.png'),
  4: require('../assets/images/showmax.webp'),
};

const Cable = () => {
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [iucNumber, setIucNumber] = useState('');
  const [validatedUser, setValidatedUser] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const [plans, setPlans] = useState([]);
  const [cables, setCables] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingCables, setLoadingCables] = useState(false);

  // Example recent IUC numbers (you can customize)
  const recentIucs = [
    { number: '12121212121', providerId: 2 },
    { number: '23232323232', providerId: 1 },
    { number: '34343434343', providerId: 3 },
  ];

  // Fetch cables and plans on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingCables(true);
      setLoadingPlans(true);
      try {
        const cablesRes = await vtuAPI.getCables();
        if (cablesRes.status && cablesRes.results?.data) {
          setCables(cablesRes.results.data);
          console.log('Cables loaded:', cablesRes.results.data);
        } else {
          Alert.alert('Error', 'Failed to load cable providers');
        }
      } catch (error) {
        Alert.alert('Error', 'Error fetching cables');
        console.error(error);
      } finally {
        setLoadingCables(false);
      }

      try {
        const plansRes = await vtuAPI.getCablePlans();
        if (plansRes.status && plansRes.results?.data) {
          setPlans(plansRes.results.data);
          console.log('Plans loaded:', plansRes.results.data);
        } else {
          Alert.alert('Error', 'Failed to load plans');
        }
      } catch (error) {
        Alert.alert('Error', 'Error fetching plans');
        console.error(error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchData();
  }, []);

  // Format price with commas
  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? price : num.toLocaleString();
  };

  // Filter plans by selected provider id
  const filteredPlans = selectedProvider
    ? plans.filter((plan) => Number(plan.cable_id) === Number(selectedProvider))
    : [];

  // Get provider icon (fallback to local images)
  const getProviderIcon = (providerId) => {
    const provider = cables.find((c) => Number(c.id) === Number(providerId));
    if (provider?.icon) return { uri: provider.icon };
    return cableIcons[providerId] || null;
  };

  // Handle IUC number validation
  const handleValidate = async () => {
    if (!iucNumber || !selectedProvider) {
      Alert.alert('Validation Error', 'Please select provider and enter IUC number');
      return;
    }

    setIsValidating(true);
    setValidatedUser('');

    try {
      const res = await vtuAPI.verifyBillNo({
        billersCode: iucNumber,
        serviceID: selectedProvider,
      });

      if (res.success) {
        const customerName =
          res.data?.results?.data?.content?.Customer_Name ||
          res.data?.results?.data?.customerName ||
          'Verified User';
        setValidatedUser(customerName);
      } else {
        Alert.alert('Validation Failed', res.error || 'Invalid IUC number or provider');
      }
    } catch (error) {
      console.error('Validation error:', error);
      Alert.alert('Validation Error', 'An error occurred during validation');
    } finally {
      setIsValidating(false);
    }
  };

  // Handle purchase proceed
  const handleProceed = async () => {
    if (!phoneNumber || !iucNumber || !selectedPlan || !selectedProvider || !validatedUser) {
      Alert.alert('Error', 'Please fill in all fields and validate IUC number');
      return;
    }

    const payload = {
      phone: phoneNumber,
      billersCode: iucNumber,
      planID: selectedPlan.id,
    };

    try {
      const res = await vtuAPI.buyCable(payload);
      if (res.success) {
        navigation.navigate('Success', {
          title: 'Payment Successful',
          message: res.data.message,
          reference: res.data.results.data.requestId,
        });
      } else {
        Alert.alert('Purchase Failed', res.error || 'Failed to buy cable');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Error', 'An error occurred during purchase');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Cable TV Purchase</Text>
      </View>

      {/* Recent IUCs */}
      <View className="px-7 mb-4 flex flex-row gap-x-2">
        {recentIucs.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center mr-4"
            onPress={() => {
              setIucNumber(item.number);
              setSelectedProvider(Number(item.providerId));
              setValidatedUser('');
              setSelectedPlan(null);
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image source={getProviderIcon(item.providerId)} className="w-8 h-8" />
            </View>
            <Text className="text-white text-xs">{item.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 bg-white rounded-t-3xl px-4 pt-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Phone Number */}
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

        {/* Providers */}
        <View className="mb-6">
          <Text className="text-gray-800 font-medium mb-2">Select Provider</Text>
          {loadingCables ? (
            <ActivityIndicator size="large" color="#4B39EF" />
          ) : cables.length === 0 ? (
            <Text className="text-center text-gray-600">No cable providers available.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {cables.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  className={`w-32 h-20 items-center justify-center rounded-lg ${
                    selectedProvider === Number(provider.id) ? 'bg-[#4B39EF]' : 'bg-[#3C3ADD21]'
                  }`}
                  onPress={() => {
                    setSelectedProvider(Number(provider.id));
                    setValidatedUser('');
                    setSelectedPlan(null);
                  }}
                >
                  <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                    <Image source={getProviderIcon(provider.id)} className="w-8 h-8" />
                  </View>
                  <Text className="text-sm font-medium text-center text-gray-800">
                    {provider.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* IUC Validation */}
        <View className="mb-4">
          <Text className="text-gray-800 font-medium mb-2">IUC Number</Text>
          <View className="flex-row mb-1">
            <TextInput
              className="h-12 bg-white border border-gray-200 rounded-lg px-4 flex-1 mr-2"
              placeholder="Enter IUC Number"
              keyboardType="numeric"
              value={iucNumber}
              onChangeText={setIucNumber}
              maxLength={15}
            />
            <TouchableOpacity
              className={`h-12 px-4 rounded-lg items-center justify-center ${
                iucNumber && selectedProvider ? 'bg-black' : 'bg-gray-400'
              }`}
              onPress={handleValidate}
              disabled={!iucNumber || !selectedProvider || isValidating}
            >
              {isValidating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-medium">Validate</Text>
              )}
            </TouchableOpacity>
          </View>
          {validatedUser ? (
            <Text className="text-right text-gray-600 mb-4">{validatedUser}</Text>
          ) : null}
        </View>

        {/* Plan Selection */}
        <Text className="text-gray-800 font-medium mb-3">Select a Plan</Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8 min-h-[100px]">
          {loadingPlans ? (
            <ActivityIndicator size="large" color="#4B39EF" />
          ) : filteredPlans.length === 0 ? (
            <Text className="text-center text-gray-600">No plans available for this provider.</Text>
          ) : (
            filteredPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                className={`flex-row items-center p-3 mb-3 rounded-lg ${
                  selectedPlan?.id === plan.id ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedPlan(plan)}
              >
                <View className="flex-1">
                  <Text
                    className={`font-medium text-base ${
                      selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {plan.name}
                  </Text>
                  <Text
                    className={`mt-1 text-sm ${
                      selectedPlan?.id === plan.id ? 'text-gray-200' : 'text-gray-600'
                    }`}
                  >
                    {formatPrice(plan.price)} NGN
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-lg items-center justify-center mb-10 ${
            phoneNumber &&
            iucNumber &&
            selectedPlan &&
            selectedProvider &&
            validatedUser
              ? 'bg-black'
              : 'bg-gray-400'
          }`}
          disabled={
            !(
              phoneNumber &&
              iucNumber &&
              selectedPlan &&
              selectedProvider &&
              validatedUser
            )
          }
          onPress={handleProceed}
        >
          <Text className="text-white font-semibold text-lg">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cable;

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
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vtuAPI } from '../services/apiServices';

// Local fallback icons
const cableIcons = {
  dstv: require('../assets/images/dstv.png'),
  gotv: require('../assets/images/gotv.png'),
  startimes: require('../assets/images/startimes.png'),
  showmax: require('../assets/images/showmax.webp'),
};

const Cable = () => {
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [iucNumber, setIucNumber] = useState('');
  const [validatedUser, setValidatedUser] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const [plans, setPlans] = useState([]);
  const [cables, setCables] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingCables, setLoadingCables] = useState(false);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successInfo, setSuccessInfo] = useState({
    title: '',
    message: '',
    reference: '',
  });

  const recentIucs = [
    { number: '12121212121', providerIdentifier: 'gotv' },
    { number: '23232323232', providerIdentifier: 'dstv' },
    { number: '34343434343', providerIdentifier: 'startimes' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoadingCables(true);
      setLoadingPlans(true);

      try {
        const cablesRes = await vtuAPI.getCables();
        if (
          cablesRes.success &&
          cablesRes.data?.status &&
          Array.isArray(cablesRes.data.results?.data)
        ) {
          setCables(cablesRes.data.results.data);
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
        if (
          plansRes.success &&
          plansRes.data?.status &&
          Array.isArray(plansRes.data.results?.data)
        ) {
          setPlans(plansRes.data.results.data);
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

  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? price : num.toLocaleString();
  };

  const getProviderIcon = (identifier) => {
    const provider = cables.find((c) => c.identifier === identifier);
    if (provider?.icon) return { uri: provider.icon };
    return cableIcons[identifier] || null;
  };

  const getSelectedProviderIdentifier = () => {
    const provider = cables.find((c) => c.id === selectedProvider);
    return provider?.identifier || '';
  };

  const filteredPlans = selectedProvider
    ? plans.filter((plan) => Number(plan.cable_id) === Number(selectedProvider))
    : [];

  const handleValidate = async () => {
    if (!iucNumber || !selectedProvider) {
      Alert.alert('Validation Error', 'Please select provider and enter IUC number');
      return;
    }

    const serviceID = getSelectedProviderIdentifier();
    if (!serviceID) {
      Alert.alert('Validation Error', 'Invalid provider selected');
      return;
    }

    setIsValidating(true);
    setValidatedUser('');

    try {
      const res = await vtuAPI.verifyBillNo({
        billersCode: iucNumber,
        serviceID,
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

  const clearForm = () => {
    setPhoneNumber('');
    setIucNumber('');
    setSelectedProvider(null);
    setSelectedPlan(null);
    setValidatedUser('');
  };

  const handleProceed = async () => {
    if (!phoneNumber || !iucNumber || !selectedPlan || !selectedProvider || !validatedUser) {
      Alert.alert('Error', 'Please fill in all fields and validate IUC number');
      return;
    }

    const serviceID = getSelectedProviderIdentifier();
    if (!serviceID) {
      Alert.alert('Error', 'Invalid provider selected');
      return;
    }

    const payload = {
      phone: phoneNumber,
      billersCode: iucNumber,
      planID: selectedPlan.id,
      serviceID,
    };

    try {
      const res = await vtuAPI.buyCable(payload);
      if (res.success && res.data?.success) {
        const message = res.data.message || 'Payment Successful';
        const requestId = res.data.results?.data?.requestId || '';
        const transactionStatus = res.data.results?.data?.content?.transactions?.status || 'Unknown';

        setSuccessInfo({
          title: message,
          message: `Transaction Status: ${transactionStatus}`,
          reference: requestId,
        });
        setSuccessModalVisible(true);
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
              const provider = cables.find((p) => p.identifier === item.providerIdentifier);
              if (provider) {
                setIucNumber(item.number);
                setSelectedProvider(provider.id);
                setValidatedUser('');
                setSelectedPlan(null);
              }
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image source={getProviderIcon(item.providerIdentifier)} className="w-8 h-8" />
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
                    selectedProvider === provider.id ? 'bg-[#4B39EF]' : 'bg-[#3C3ADD21]'
                  }`}
                  onPress={() => {
                    setSelectedProvider(provider.id);
                    setValidatedUser('');
                    setSelectedPlan(null);
                  }}
                >
                  <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                    <Image source={getProviderIcon(provider.identifier)} className="w-8 h-8" />
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
                    NGN {formatPrice(plan.amount)}
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

      {/* Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => {
          setSuccessModalVisible(false);
          clearForm();
        }}
      >
        <View className="flex-1 justify-center items-center bg-opacity-50 px-6">
          <View className="bg-white rounded-lg p-6 w-full max-w-md">
            <Text className="text-xl font-bold mb-4">{successInfo.title}</Text>
            <Text className="mb-2">{successInfo.message}</Text>
            {successInfo.reference ? (
              <Text className="mb-4 text-gray-600">Reference: {successInfo.reference}</Text>
            ) : null}

            <Pressable
              className="bg-[#4B39EF] rounded-lg py-3"
              onPress={() => {
                setSuccessModalVisible(false);
                clearForm();
              }}
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Cable;

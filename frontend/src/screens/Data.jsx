import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, ChevronDownIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vtuAPI } from '../services/apiServices'; // Adjust path as needed

const Data = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedDataPlan, setSelectedDataPlan] = useState(null);
  const [selectedCategory, _setSelectedCategory] = useState('SME');
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const networks = [
    { id: '9mobile', name: '9MOBILE', icon: require('../assets/images/9mobile.png') },
    { id: 'mtn', name: 'MTN', icon: require('../assets/images/mtn.png') },
    { id: 'glo', name: 'GLO', icon: require('../assets/images/glo.png') },
    { id: 'airtel', name: 'AIRTEL', icon: require('../assets/images/airtel.png') },
  ];

  const recentNumbers = [
    { number: '09098146934', network: 'mtn' },
    { number: '08123456789', network: 'glo' },
    { number: '08012345678', network: '9mobile' },
    { number: '07087654321', network: 'airtel' },
  ];

  const networkIdMap = {
    mtn: 1,
    glo: 2,
    airtel: 3,
    '9mobile': 4,
  };

  const getNetworkIcon = (networkId) => {
    return networks.find((n) => n.id === networkId)?.icon;
  };

  const formatPrice = (price) => {
    return `₦${parseFloat(price).toFixed(2)}`;
  };

  // Fetch data plans when network is selected
  useEffect(() => {
    const fetchDataPlans = async () => {
      if (!selectedNetwork) return;

      setLoading(true);
      const networkId = networkIdMap[selectedNetwork];

      const res = await vtuAPI.getDataPlansByNetwork(networkId);
      if (res.success) {
        const plans = res.data?.results?.data || [];
        setDataPlans(
          plans.map((plan) => ({
            id: plan.id,
            value: plan.size,
            price: parseFloat(plan.price),
          }))
        );
      } else {
        Alert.alert('Error', res.error || 'Failed to fetch data plans');
      }
      setLoading(false);
    };

    fetchDataPlans();
  }, [selectedNetwork]);

  const handleBuyData = async () => {
    if (!phoneNumber || !selectedNetwork || !selectedDataPlan) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        plan_id: selectedDataPlan.id,
        phone: phoneNumber,
      };

      const res = await vtuAPI.buyData(payload);

      if (res.success) {
        Alert.alert('Success', res.message || 'Data purchase successful!');
        setPhoneNumber('');
        setSelectedNetwork(null);
        setSelectedDataPlan(null);
        setDataPlans([]);
      } else {
        Alert.alert('Failed', res.error || 'Data purchase failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity className="absolute left-4 z-10" onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Data Purchase</Text>
      </View>

      {/* Recent Numbers */}
      <View className="px-7 mb-4 flex flex-row gap-x-2">
        {recentNumbers.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center mr-4"
            onPress={() => {
              setPhoneNumber(item.number);
              setSelectedNetwork(item.network);
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image source={getNetworkIcon(item.network)} className="w-8 h-8" />
            </View>
            <Text className="text-white text-xs">{item.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
        {/* Phone Number Input */}
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-800 font-medium">Phone Number</Text>
            <TouchableOpacity>
              <Text className="text-[#4B39EF] font-medium">Select</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            className="h-12 bg-white rounded-lg px-4"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Network Selection */}
        <Text className="text-gray-800 font-medium mb-3">Select Network</Text>
        <View className="flex-row justify-between mb-6">
          {networks.map((network) => (
            <TouchableOpacity
              key={network.id}
              className={`w-[23%] h-20 items-center justify-center rounded-lg ${
                selectedNetwork === network.id ? 'bg-[#F3F4F6]' : 'bg-[#3C3ADD21]'
              }`}
              onPress={() => {
                setSelectedNetwork(network.id);
                setSelectedDataPlan(null);
              }}
            >
              <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                <Image source={network.icon} className="w-8 h-8" />
              </View>
              <Text className="text-xs font-medium">{network.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Data Category */}
        <Text className="text-gray-800 font-medium mb-3">Data Category</Text>
        <TouchableOpacity className="h-14 bg-white border border-gray-200 rounded-lg px-4 flex-row justify-between items-center mb-6">
          <Text className="text-gray-800">{selectedCategory}</Text>
          <ChevronDownIcon size={20} color="#4B5563" />
        </TouchableOpacity>

        {/* Data Plan Selection */}
        <Text className="text-gray-800 font-medium mb-3">Select a Data Plan</Text>
        {loading ? (
          <View className="py-6">
            <ActivityIndicator size="large" color="#4B39EF" />
          </View>
        ) : dataPlans.length === 0 ? (
          <Text className="text-center text-gray-500 mb-8">No plans available</Text>
        ) : (
          <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8 flex-wrap flex-row justify-between">
            {dataPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                className={`w-[30%] aspect-square items-center justify-center rounded-lg mb-3 ${
                  selectedDataPlan?.id === plan.id ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedDataPlan(plan)}
              >
                <Text
                  className={`font-medium text-center ${
                    selectedDataPlan?.id === plan.id ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {plan.value}
                </Text>
                <Text
                  className={`text-xs text-center ${
                    selectedDataPlan?.id === plan.id ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {formatPrice(plan.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            phoneNumber && selectedNetwork && selectedDataPlan ? 'bg-gray-900' : 'bg-gray-400'
          }`}
          onPress={handleBuyData}
          disabled={!phoneNumber || !selectedNetwork || !selectedDataPlan || loading}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? 'Processing...' : 'Proceed'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Data;

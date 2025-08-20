import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vtuAPI } from '../services/apiServices';

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

  const providers = [
    { id: 'gotv', name: 'GOTV', icon: require('../assets/images/gotv.png') },
    { id: 'dstv', name: 'DSTV', icon: require('../assets/images/dstv.png') },
    { id: 'startimes', name: 'STARTIME', icon: require('../assets/images/startimes.png') },
  ];

  const recentIucs = [
    { number: '12121212121', provider: 'gotv' },
    { number: '23232323232', provider: 'dstv' },
    { number: '34343434343', provider: 'startimes' },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      const res = await vtuAPI.getCablePlans();
      if (res.success) {
        setPlans(res.data.results.data);
      
      }
      setLoadingPlans(false);
    };

    fetchPlans();
  }, []);
  useEffect(() => {
    const fetchCables = async () => {
      setLoadingPlans(true);
      const res = await vtuAPI.getCables();
      if (res.success) {
       setCables(res.data.results.data);
     
      }
      setLoadingPlans(false);
    };

    fetchCables();
  }, []);
  const handleValidate = async () => {
    if (!iucNumber || !selectedProvider) return;
    setIsValidating(true);

    // Simulate customer name fetch
    setTimeout(() => {
      setValidatedUser('IDOWU ABIODUN JOHNSON');
      setIsValidating(false);
    }, 1000);
  };

  const handleProceed = async () => {
    if (!phoneNumber || !iucNumber || !selectedPlan || !selectedProvider || !validatedUser) return;

    const payload = {
      phone: phoneNumber,
      billersCode: iucNumber,
      planID: selectedPlan.id,
    };

    const res = await vtuAPI.buyCable(payload);

    if (res.success) {
      navigation.navigate('Success', {
        title: 'Payment Successful',
        message: res.data.message,
        reference: res.data.results.data.requestId,
      });
    } else {
      alert(res.error || 'Cable TV purchase failed.');
    }
  };

  const getProviderIcon = (providerId) => {
    return providers.find((p) => p.id === providerId)?.icon;
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  const filteredPlans = selectedProvider
    ? plans?.filter((p) => p?.cable_id === selectedProvider)
    : [];

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
              setSelectedProvider(item.provider);
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image source={getProviderIcon(item.provider)} className="w-8 h-8" />
            </View>
            <Text className="text-white text-xs">{item.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Form */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
        {/* Phone Input */}
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

       
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ gap: 12 }} 
  className="mb-6"
>
          {cables.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              className={`w-32 h-20 items-center justify-center rounded-lg ${
                selectedProvider === provider.id ? 'bg-[#4B39EF]' : 'bg-[#3C3ADD21]'
              }`}
              onPress={() => setSelectedProvider(provider.id)}
            >
              <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                <Image source={provider.icon} className="w-8 h-8" />
              </View>
              <Text className="text-sm font-medium text-center text-gray-800">{provider.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* IUC Validation */}
        <View className="mb-1">
          <Text className="text-gray-800 font-medium mb-2">IUC Number</Text>
          <View className="flex-row mb-1">
            <TextInput
              className="h-12 bg-white border border-gray-200 rounded-lg px-4 flex-1 mr-2"
              placeholder="Enter IUC Number"
              keyboardType="numeric"
              value={iucNumber}
              onChangeText={setIucNumber}
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
        <Text className="text-gray-800 font-medium mb-3 mt-2">Select a Plan</Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8">
          {loadingPlans ? (
            <ActivityIndicator size="large" color="#4B39EF" />
          ) : (
            <View className="flex-row flex-wrap justify-between gap-y-2">
              {filteredPlans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  className={`w-[30%] p-2 rounded-lg items-center justify-center ${
                    selectedPlan?.id === plan.id ? 'bg-[#4B39EF]' : 'bg-white'
                  }`}
                  onPress={() => setSelectedPlan(plan)}
                >
                  <Text
                    className={`font-medium text-center text-xs ${
                      selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {plan.name}
                  </Text>
                  <Text
                    className={`text-xs ${
                      selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    ₦{formatPrice(plan.amount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            phoneNumber && selectedProvider && selectedPlan && iucNumber && validatedUser
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleProceed}
          disabled={
            !phoneNumber || !selectedProvider || !selectedPlan || !iucNumber || !validatedUser
          }
        >
          <Text className="text-white font-semibold text-base">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cable;

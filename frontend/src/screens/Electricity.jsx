import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Electricity = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [validatedUser, setValidatedUser] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Provider options
  const providers = [
    {id: 'ikedc', name: 'IKEDC', icon: require('../assets/images/ikedc.png')},
    {id: 'ekedc', name: 'EKEDC', icon: require('../assets/images/ekedc.png')},
    {id: 'ibedc', name: 'IBEDC', icon: require('../assets/images/ibedc.png')},
    {id: 'jedc', name: 'JEDC', icon: require('../assets/images/jedc.png')},
    {id: 'aedc', name: 'AEDC', icon: require('../assets/images/aedc.png')},
  ];

  // Amount options
  const amounts = [
    {value: 500, display: '₦ 500'},
    {value: 1000, display: '₦ 1,000'},
    {value: 1500, display: '₦ 1,500'},
    {value: 2000, display: '₦ 2,000'},
    {value: 2500, display: '₦ 2,500'},
    {value: 2500, display: '₦ 2,500'},
    {value: 3000, display: '₦ 3,000'},
    {value: 3500, display: '₦ 3,500'},
    {value: 4000, display: '₦ 4,000'},
    {value: 5000, display: '₦ 5,000'},
  ];

  // Recent meter numbers
  const recentMeters = [
    {number: '11111111111', provider: 'ikedc'},
    {number: '11111111111', provider: 'ekedc'},
    {number: '11111111111', provider: 'ikedc'},
    {number: '11111111111', provider: 'aedc'},
  ];

  const handleValidate = () => {
    if (!meterNumber || !selectedProvider) return;

    setIsValidating(true);

    setTimeout(() => {
      setValidatedUser('JOHN DOE');
      setIsValidating(false);
    }, 1500);
  };

  const handleProceed = () => {
    if (phoneNumber && selectedProvider && selectedAmount && meterNumber) {
      navigation.navigate('Pin', {
        phoneNumber,
        provider: selectedProvider,
        amount: selectedAmount,
        meterNumber,
        customerName: validatedUser,
        transactionType: 'Electricity Bill Payment',
      });
    }
  };

  const getProviderIcon = providerId => {
    return providers.find(p => p.id === providerId)?.icon;
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
            }}>
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image
                source={getProviderIcon(item.provider)}
                className="w-8 h-8"
              />
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
          {providers.map(provider => (
            <TouchableOpacity
              key={provider.id}
              className={`w-[18%] h-20 items-center justify-center rounded-lg bg-[#3C3ADD21] mb-2`}
              onPress={() => setSelectedProvider(provider.id)}>
              <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                <Image source={provider.icon} className="w-8 h-8" />
              </View>
              <Text className="text-xs font-medium">{provider.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meter Number with Validation */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-800 font-medium">Meter Number</Text>
            <TouchableOpacity
              className={`px-4 py-1 rounded-lg items-center justify-center ${
                meterNumber && selectedProvider ? 'bg-black' : 'bg-gray-400'
              }`}
              onPress={handleValidate}
              disabled={!meterNumber || !selectedProvider || isValidating}>
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
            onChangeText={setMeterNumber}
          />
          {validatedUser ? (
            <Text className="text-right text-gray-600 mt-1">
              {validatedUser}
            </Text>
          ) : null}
        </View>

        {/* Amount Selection */}
        <Text className="text-gray-800 font-medium mb-3">Select an Amount</Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8">
          {/* First Row - 5 amounts */}
          <View className="flex-row justify-between mb-2">
            {amounts.slice(0, 5).map((amount, index) => (
              <TouchableOpacity
                key={index}
                className={`w-[18%] aspect-square items-center justify-center rounded-lg ${
                  selectedAmount === amount.value ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedAmount(amount.value)}>
                <Text
                  className={`font-medium text-center ${
                    selectedAmount === amount.value
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}>
                  {amount.display}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second Row - 5 amounts */}
          <View className="flex-row justify-between">
            {amounts.slice(5, 10).map((amount, index) => (
              <TouchableOpacity
                key={index + 5}
                className={`w-[18%] aspect-square items-center justify-center rounded-lg ${
                  selectedAmount === amount.value ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedAmount(amount.value)}>
                <Text
                  className={`font-medium text-center ${
                    selectedAmount === amount.value
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}>
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
            !phoneNumber || !selectedProvider || !selectedAmount || !meterNumber
          }>
          <Text className="text-white font-semibold text-base">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Electricity;

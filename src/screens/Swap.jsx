import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Swap = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [airtimeAmount, setAirtimeAmount] = useState('');
  const [cashValue, setCashValue] = useState('1,500.00');

  // Network options
  const networks = [
    {id: 'mtn', name: 'MTN', icon: require('../assets/images/mtn.png')},
    {id: 'glo', name: 'GLO', icon: require('../assets/images/glo.png')},
    {
      id: '9mobile',
      name: '9MOBILE',
      icon: require('../assets/images/9mobile.png'),
    },
    {
      id: 'airtel',
      name: 'AIRTEL',
      icon: require('../assets/images/airtel.png'),
    },
  ];

  // Recent numbers
  const recentNumbers = [
    {number: '09098146934', network: 'mtn'},
    {number: '09098146934', network: 'glo'},
    {number: '09098146934', network: '9mobile'},
    {number: '09098146934', network: 'airtel'},
  ];

  // Calculate cash value based on airtime amount
  useEffect(() => {
    if (airtimeAmount) {
      const amount = parseFloat(airtimeAmount.replace(/,/g, ''));
      if (!isNaN(amount)) {
        // Example: 75% of airtime value
        const calculatedValue = (amount * 0.75).toFixed(2);
        setCashValue(calculatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      }
    } else {
      setCashValue('0.00');
    }
  }, [airtimeAmount]);

  const handleAirtimeAmountChange = text => {
    // Remove non-numeric characters except commas
    const cleanedText = text.replace(/[^0-9,]/g, '');
    setAirtimeAmount(cleanedText);
  };

  const handleProceed = () => {
    if (phoneNumber && selectedNetwork && airtimeAmount) {
      navigation.navigate('Pin', {
        phoneNumber,
        network: selectedNetwork,
        airtimeAmount,
        cashValue,
        transactionType: 'Airtime Swap',
      });
    }
  };

  const getNetworkIcon = networkId => {
    return networks.find(n => n.id === networkId)?.icon;
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
        <Text className="text-white text-lg font-semibold">Airtime Swap</Text>
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
            }}>
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image
                source={getNetworkIcon(item.network)}
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
        <View className="bg-[#F3F4F6] p-4 rounded-xl mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-800 font-medium">Phone Number</Text>
            <TouchableOpacity>
              <Text className="text-[#4B39EF] font-medium">Select contact</Text>
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
          {networks.map(network => (
            <TouchableOpacity
              key={network.id}
              className={`w-[23%] h-20 items-center justify-center rounded-lg ${
                selectedNetwork === network.id ? 'bg-[#F3F4F6]' : 'bg-[#F3F4F6]'
              }`}
              onPress={() => setSelectedNetwork(network.id)}>
              <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                <Image source={network.icon} className="w-8 h-8" />
              </View>
              <Text className="text-xs font-medium">{network.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Airtime Amount Input */}
        <View className="bg-[#F3F4F6] p-4 rounded-xl mb-6">
          <Text className="text-gray-800 font-medium mb-2">Airtime Amount</Text>
          <TextInput
            className="h-12 bg-white rounded-lg px-4"
            placeholder="Enter airtime amount"
            keyboardType="numeric"
            value={airtimeAmount}
            onChangeText={handleAirtimeAmountChange}
          />
        </View>

        {/* Cash Value Display */}
        <Text className="text-gray-800 font-medium mb-2">You're getting</Text>
        <View className="bg-[#3C3ADD21] p-5 rounded-xl mb-8 items-center">
          <Text className="text-3xl font-bold">N {cashValue}</Text>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            phoneNumber && selectedNetwork && airtimeAmount
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleProceed}
          disabled={!phoneNumber || !selectedNetwork || !airtimeAmount}>
          <Text className="text-white font-semibold text-base">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Swap;

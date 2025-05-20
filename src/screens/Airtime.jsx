import {useState} from 'react';
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

const Airtime = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);

  // Network options
  const networks = [
    {id: 'mtn', name: 'MTN', icon: require('../assets/images/mtn.png')},
    {id: 'glo', name: 'GLO', icon: require('../assets/images/glo.png')},
    {
      id: 'airtel',
      name: 'AIRTEL',
      icon: require('../assets/images/airtel.png'),
    },
    {
      id: '9mobile',
      name: '9MOBILE',
      icon: require('../assets/images/9mobile.png'),
    },
  ];

  // Amount options
  const amounts = [
    {value: 100, display: 'N 100'},
    {value: 200, display: 'N 200'},
    {value: 500, display: 'N 500'},
    {value: 1000, display: 'N 1,000'},
    {value: 2000, display: 'N 2,000'},
    {value: 5000, display: 'N 5,000'},
    {value: 10000, display: 'N 10,000'},
    {value: 11000, display: 'N 11,000'},
  ];

  // Recent numbers
  const recentNumbers = [
    {number: '09098146934', network: 'mtn'},
    {number: '09098146934', network: 'glo'},
    {number: '09098146934', network: 'airtel'},
    {number: '09098146934', network: '9mobile'},
  ];

  const handleProceed = () => {
    if (phoneNumber && selectedNetwork && selectedAmount) {
      navigation.navigate('ConfirmAirtime', {
        phoneNumber,
        network: selectedNetwork,
        amount: selectedAmount,
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
        <Text className="text-white text-lg font-semibold">
          Airtime Purchase
        </Text>
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
      <ScrollView className="bg-white rounded-t-3xl px-4 pt-6">
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
              className={`w-[23%] h-16 items-center justify-center rounded-lg ${
                selectedNetwork === network.id
                  ? 'bg-[#F3F4F6]'
                  : 'bg-[#3C3ADD21]'
              }`}
              onPress={() => setSelectedNetwork(network.id)}>
              <View className="w-8 h-8 rounded-full bg-white justify-center items-center mb-1">
                <Image source={network.icon} className="w-6 h-6" />
              </View>
              <Text className="text-xs font-medium">{network.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount Selection */}
        <Text className="text-gray-800 font-medium mb-3 mt-8">
          Select an Amount
        </Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8 flex-row flex-wrap justify-between">
          {amounts.map((amount, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[24%] h-12 items-center justify-center rounded-lg mb-4 ${
                selectedAmount === amount.value ? 'bg-[#4B39EF]' : 'bg-white'
              }`}
              onPress={() => setSelectedAmount(amount.value)}>
              <Text
                className={`font-medium ${
                  selectedAmount === amount.value
                    ? 'text-white'
                    : 'text-gray-800'
                }`}>
                {amount.display}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            phoneNumber && selectedNetwork && selectedAmount
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleProceed}
          disabled={!phoneNumber || !selectedNetwork || !selectedAmount}>
          <Text className="text-white font-semibold text-base">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Airtime;

import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Betting = () => {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bettingID, setBettingID] = useState('');
  const [validatedUser, setValidatedUser] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Provider options with online images
  const providers = [
    {
      id: 'provider1',
      name: 'BetKing',
      icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/BetKing_Logo.svg/1200px-BetKing_Logo.svg.png',
    },
    {
      id: 'provider2',
      name: 'NairaBet',
      icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Nairabet_logo.svg/1200px-Nairabet_logo.svg.png',
    },
    {
      id: 'provider3',
      name: 'Bet9ja',
      icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Bet9ja_logo.svg/1200px-Bet9ja_logo.svg.png',
    },
    {
      id: 'provider4',
      name: 'Merrybet',
      icon: 'https://www.merrybet.com/assets/images/merrybet-logo.svg',
    },
    {
      id: 'provider5',
      name: '1xBet',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/1xbet_Logo.svg',
    },
  ];

  // Amount options (unchanged)
  const amounts = [
    {value: 500, display: '₦ 500'},
    {value: 1000, display: '₦ 1,000'},
    {value: 1500, display: '₦ 1,500'},
    {value: 2000, display: '₦ 2,000'},
    {value: 2500, display: '₦ 2,500'},
    {value: 3000, display: '₦ 3,000'},
    {value: 3500, display: '₦ 3,500'},
    {value: 4000, display: '₦ 4,000'},
    {value: 5000, display: '₦ 5,000'},
    {value: 10000, display: '₦ 10,000'},
  ];

  // Recent bet providers (show provider icons + name)
  const recentProviders = [
    {id: 'provider1', name: 'BetKing'},
    {id: 'provider2', name: 'NairaBet'},
    {id: 'provider3', name: 'Bet9ja'},
    {id: 'provider4', name: 'Merrybet'},
  ];

  const handleValidate = () => {
    if (!bettingID || !selectedProvider) return;

    setIsValidating(true);

    setTimeout(() => {
      setValidatedUser('JOHN DOE'); // Dummy user name for validation
      setIsValidating(false);
    }, 1500);
  };

  const handleProceed = () => {
    if (selectedProvider && selectedAmount && bettingID) {
      navigation.navigate('Pin', {
        provider: selectedProvider,
        amount: selectedAmount,
        bettingID,
        customerName: validatedUser,
        transactionType: 'Bet Purchase',
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
        <Text className="text-white text-lg font-semibold">Bet Purchase</Text>
      </View>

      {/* Recent Bet Providers */}
      <View className="px-7 mb-4 flex flex-row gap-x-4 mx-auto">
        {recentProviders.map(item => (
          <TouchableOpacity
            key={item.id}
            className="items-center mr-4"
            onPress={() => setSelectedProvider(item.id)}>
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1 overflow-hidden">
              <Image
                source={{uri: getProviderIcon(item.id)}}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>
            <Text className="text-white text-xs">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
        {/* Select Provider Popup Trigger */}
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-6">
          <Text className="text-gray-800 font-medium mb-2">Select Provider</Text>
          <TouchableOpacity
            className="h-12 bg-white rounded-lg px-4 justify-center"
            onPress={() => setModalVisible(true)}>
            <Text className="text-gray-800">
              {selectedProvider
                ? providers.find(p => p.id === selectedProvider)?.name
                : 'Select a provider'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal for Provider Selection */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View className="flex-1 justify-center bg-[#9db0f585]  p-6">
            <View className="bg-white rounded-lg p-4 max-h-96">
              <Text className="text-lg font-semibold mb-4">Select Provider</Text>
              <FlatList
                data={providers}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    className="flex-row items-center mb-3"
                    onPress={() => {
                      setSelectedProvider(item.id);
                      setModalVisible(false);
                    }}>
                    <Image
                      source={{uri: item.icon}}
                      className="w-10 h-10 rounded-full mr-3"
                      resizeMode="contain"
                    />
                    <Text className="text-base">{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                className="mt-4 py-2 bg-gray-300 rounded-lg items-center"
                onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Betting 
        ID with Validation */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-800 font-medium">Betting ID</Text>
            {/* <TouchableOpacity
              className={`px-4 py-1 rounded-lg items-center justify-center ${
                bettingID && selectedProvider ? 'bg-black' : 'bg-gray-400'
              }`}
              onPress={handleValidate}
              disabled={!bettingID || !selectedProvider || isValidating}>
              {isValidating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-medium">Validate</Text>
              )}
            </TouchableOpacity> */}
          </View>
          <TextInput
            className="h-12 bg-white border border-gray-200 rounded-lg px-4"
            placeholder="Enter Betting ID"
            keyboardType="default"
            value={bettingID}
            onChangeText={setBettingID}
          />
          {validatedUser ? (
            <Text className="text-right text-gray-600 mt-1">{validatedUser}</Text>
          ) : null}
        </View>

        {/* Amount Selection (unchanged) */}
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

          {/* Second Row - remaining amounts */}
          <View className="flex-row justify-between">
            {amounts.slice(5).map((amount, index) => (
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
            selectedProvider && selectedAmount && bettingID
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleProceed}
          disabled={!selectedProvider || !selectedAmount || !bettingID}>
          <Text className="text-white font-semibold text-base">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Betting;

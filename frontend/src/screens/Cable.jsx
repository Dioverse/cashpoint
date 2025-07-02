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

const Cable = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [iucNumber, setIucNumber] = useState('');
  const [validatedUser, setValidatedUser] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Provider options
  const providers = [
    {id: 'gotv', name: 'GOTV', icon: require('../assets/images/gotv.png')},
    {id: 'dstv', name: 'DSTV', icon: require('../assets/images/dstv.png')},
    {
      id: 'startimes',
      name: 'STARTIME',
      icon: require('../assets/images/startimes.png'),
    },
  ];

  // Plan options
  const plans = [
    {name: 'Smalie', price: 680.0, id: 'plan1'},
    {name: 'Big', price: 1360.0, id: 'plan2'},
    {name: 'Home', price: 2040.0, id: 'plan3'},
    {name: 'Hize', price: 2720.0, id: 'plan4'},
    {name: 'Hamp', price: 3400.0, id: 'plan5'},
    {name: 'Uit', price: 680.0, id: 'plan6'},
    {name: 'Homp', price: 1360.0, id: 'plan7'},
    {name: 'Pro', price: 340.0, id: 'plan8'},
    {name: 'Joly', price: 2720.0, id: 'plan9'},
    {name: 'Lily', price: 3400.0, id: 'plan10'},
  ];

  // Recent IUC numbers
  const recentIucs = [
    {number: '12121212121', provider: 'gotv'},
    {number: '12121212121', provider: 'dstv'},
    {number: '12121212121', provider: 'gotv'},
    {number: '12121212121', provider: 'startimes'},
  ];

  const handleValidate = () => {
    if (!iucNumber || !selectedProvider) return;

    setIsValidating(true);

    // Simulate API call to validate IUC
    setTimeout(() => {
      setValidatedUser('IDOWU ABIODUN JOHNSON');
      setIsValidating(false);
    }, 1500);
  };

  const handleProceed = () => {
    if (
      phoneNumber &&
      selectedProvider &&
      selectedPlan &&
      iucNumber &&
      validatedUser
    ) {
      navigation.navigate('Pin', {
        phoneNumber,
        provider: selectedProvider,
        amount: selectedPlan.price,
        plan: selectedPlan.name,
        iucNumber,
        customerName: validatedUser,
        transactionType: 'Cable TV Subscription',
      });
    }
  };

  const getProviderIcon = providerId => {
    return providers.find(p => p.id === providerId)?.icon;
  };

  const formatPrice = price => {
    return price.toFixed(2);
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
          Cable Tv Purchase
        </Text>
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
        <View className="flex-row justify-between mb-6">
          {providers.map(provider => (
            <TouchableOpacity
              key={provider.id}
              className={`w-[31%] h-20 items-center justify-center rounded-lg bg-[#3C3ADD21]`}
              onPress={() => setSelectedProvider(provider.id)}>
              <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
                <Image source={provider.icon} className="w-8 h-8" />
              </View>
              <Text className="text-sm font-medium">{provider.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* IUC Number with Validation */}
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
              disabled={!iucNumber || !selectedProvider || isValidating}>
              {isValidating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-medium">Validate</Text>
              )}
            </TouchableOpacity>
          </View>
          {validatedUser ? (
            <Text className="text-right text-gray-600 mb-4">
              {validatedUser}
            </Text>
          ) : null}
        </View>

        {/* Plan Selection */}
        <Text className="text-gray-800 font-medium mb-3 mt-2">
          Select an Plan
        </Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8">
          {/* First Row - 5 plans */}
          <View className="flex-row justify-between mb-2">
            {plans.slice(0, 5).map(plan => (
              <TouchableOpacity
                key={plan.id}
                className={`w-[18%] aspect-square items-center justify-center rounded-lg ${
                  selectedPlan?.id === plan.id ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedPlan(plan)}>
                <Text
                  className={`font-medium text-center ${
                    selectedPlan?.id === plan.id
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}>
                  {plan.name}
                </Text>
                <Text
                  className={`text-xs text-center ${
                    selectedPlan?.id === plan.id
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                  {formatPrice(plan.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second Row - 5 plans */}
          <View className="flex-row justify-between">
            {plans.slice(5, 10).map(plan => (
              <TouchableOpacity
                key={plan.id}
                className={`w-[18%] aspect-square items-center justify-center rounded-lg ${
                  selectedPlan?.id === plan.id ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedPlan(plan)}>
                <Text
                  className={`font-medium text-center ${
                    selectedPlan?.id === plan.id
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}>
                  {plan.name}
                </Text>
                <Text
                  className={`text-xs text-center ${
                    selectedPlan?.id === plan.id
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                  {formatPrice(plan.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            phoneNumber &&
            selectedProvider &&
            selectedPlan &&
            iucNumber &&
            validatedUser
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleProceed}
          disabled={
            !phoneNumber ||
            !selectedProvider ||
            !selectedPlan ||
            !iucNumber ||
            !validatedUser
          }>
          <Text className="text-white font-semibold text-base">Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cable;

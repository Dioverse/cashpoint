import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon, EyeIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const LockFunds = () => {
  const navigation = useNavigation();
  const [isAmountVisible, setIsAmountVisible] = useState(true);
  const [lockAmount, setLockAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Mock total balance
  const totalBalance = 105000.0;

  // Lock period options
  const periods = [
    {value: '1 Month', id: 'period1'},
    {value: '2 Months', id: 'period2'},
    {value: '3 Months', id: 'period3'},
    {value: '6 Months', id: 'period4'},
    {value: '1 Year', id: 'period5'},
    {value: '2 Years', id: 'period6'},
    {value: '3 Years', id: 'period7'},
    {value: '4 Years', id: 'period8'},
  ];

  const formatAmount = amount => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAmountChange = text => {
    // Remove non-numeric characters
    const cleanedText = text.replace(/[^0-9]/g, '');
    setLockAmount(cleanedText);
  };

  const handleLockFunds = () => {
    if (lockAmount && selectedPeriod) {
      // Logic to lock funds
      navigation.navigate('SaveEarn', {
        lockedAmount: lockAmount,
        lockPeriod: selectedPeriod,
      });
    }
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
        <Text className="text-white text-lg font-semibold">Lock Funds</Text>
      </View>

      {/* Balance Display */}
      <View className="flex-row items-center justify-center my-8">
        <Text className="text-white text-5xl font-bold mr-2">
          {isAmountVisible ? `₦${formatAmount(totalBalance)}` : '₦••••••••'}
        </Text>
        <TouchableOpacity onPress={() => setIsAmountVisible(!isAmountVisible)}>
          <EyeIcon size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-8">
        <Text className="text-3xl font-bold text-center mb-8">
          Lock Your Funds
        </Text>

        {/* Amount Input */}
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-6">
          <Text className="text-gray-800 font-medium mb-2">Amount</Text>
          <TextInput
            className="h-14 bg-white rounded-lg px-4"
            placeholder="Enter amount to lock"
            keyboardType="numeric"
            value={lockAmount}
            onChangeText={handleAmountChange}
          />
        </View>

        {/* Lock Period Selection */}
        <Text className="text-gray-800 font-medium mb-3">
          Deposits are subject to a lock period
        </Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8">
          {/* First Row - 4 periods */}
          <View className="flex-row justify-between mb-3">
            {periods.slice(0, 4).map(period => (
              <TouchableOpacity
                key={period.id}
                className={`w-[24%] h-14 items-center justify-center rounded-lg ${
                  selectedPeriod === period.value ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedPeriod(period.value)}>
                <Text
                  className={`font-medium ${
                    selectedPeriod === period.value
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}>
                  {period.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second Row - 4 periods */}
          <View className="flex-row justify-between">
            {periods.slice(4, 8).map(period => (
              <TouchableOpacity
                key={period.id}
                className={`w-[24%] h-14 items-center justify-center rounded-lg ${
                  selectedPeriod === period.value ? 'bg-[#4B39EF]' : 'bg-white'
                }`}
                onPress={() => setSelectedPeriod(period.value)}>
                <Text
                  className={`font-medium ${
                    selectedPeriod === period.value
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}>
                  {period.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lock Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            lockAmount && selectedPeriod ? 'bg-gray-900' : 'bg-gray-400'
          }`}
          onPress={handleLockFunds}
          disabled={!lockAmount || !selectedPeriod}>
          <Text className="text-white font-semibold text-base">Lock</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LockFunds;

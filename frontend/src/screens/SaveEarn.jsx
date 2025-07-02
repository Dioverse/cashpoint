import {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  EyeIcon,
  LockClosedIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const SaveEarn = () => {
  const navigation = useNavigation();
  const [isAmountVisible, setIsAmountVisible] = useState(true);

  // Mock transaction data
  const transactions = [
    {
      id: '1',
      type: 'Earn and save',
      amount: 2500.0,
      date: 'February 1 2025 12:00:54',
    },
    {
      id: '2',
      type: 'Earn and save',
      amount: 2500.0,
      date: 'March 1 2025 12:00:30',
    },
  ];

  // Mock statistics data
  const statistics = {
    totalSaved: 105000.0,
    totalInterest: 5000.0,
    timesSaved: 2.0,
    interestRate: 2.5,
  };

  const formatAmount = amount => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleLockFunds = () => {
    navigation.navigate('LockFunds');
  };

  const handleWithdraw = () => {
    // Logic to withdraw funds
    navigation.navigate('WithdrawFunds');
  };

  const handleViewAllTransactions = () => {
    navigation.navigate('AllTransactions');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header with Balance */}
      <View className="px-4 pt-4 pb-6">
        <TouchableOpacity
          className="mt-2 mb-6"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row justify-center items-center gap-x-2">
          <Text className="text-white text-5xl font-bold">
            {isAmountVisible
              ? `₦${formatAmount(statistics.totalSaved)}`
              : '₦••••••••'}
          </Text>
          <TouchableOpacity
            onPress={() => setIsAmountVisible(!isAmountVisible)}>
            <EyeIcon size={24} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-[#3C3ADD21] bg-opacity-20 px-4 py-2 rounded-lg mt-4 flex-row items-center justify-center"
          onPress={handleLockFunds}>
          <LockClosedIcon size={16} color="white" />
          <Text className="text-white font-medium ml-2">Lock Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
        {/* Statistics */}
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-gray-600 text-base">
              Number of times saved
            </Text>
            <Text className="text-black text-xl font-semibold mt-1">
              {statistics.timesSaved}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-600 text-base">Total Interest (₦)</Text>
            <Text className="text-black text-xl font-semibold mt-1">
              {formatAmount(statistics.totalInterest)}
            </Text>
          </View>
        </View>

        {/* Interest Rate Info */}
        <View className="bg-gray-100 rounded-lg py-4 px-4 mb-6">
          <Text className="text-black text-center text-base">
            Earn {statistics.interestRate}% on your savings every month
          </Text>
        </View>

        {/* Recent Activities */}
        <View className="bg-gray-100 rounded-lg p-4 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black text-xl font-bold">
              Recent activities
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={handleViewAllTransactions}>
              <Text className="text-gray-600 mr-1">View all</Text>
              <ChevronRightIcon size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Transactions List */}
          {transactions.map((transaction, index) => (
            <View
              key={transaction.id}
              className={`py-3 ${
                index < transactions.length - 1
                  ? 'border-b border-gray-200'
                  : ''
              }`}>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-black text-base font-semibold">
                    {transaction.type}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {transaction.date}
                  </Text>
                </View>
                <Text className="text-black text-base font-semibold">
                  + ₦{formatAmount(transaction.amount)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          className="h-14 rounded-xl items-center justify-center mb-6 bg-gray-900"
          onPress={handleWithdraw}>
          <Text className="text-white font-semibold text-base">Withdraw</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SaveEarn;

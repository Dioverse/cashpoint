import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import withdrawalService from '../services/withdrawalService';
import {useAuth} from '../context/AuthContext';

const Withdrawal = () => {
  const navigation = useNavigation();
  const {user} = useAuth();

  const [balance, setBalance] = useState({naira_balance: 0, usd_balance: 0});
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawalTypes] = useState(withdrawalService.getWithdrawalTypes());

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      setIsLoading(true);
      const response = await withdrawalService.getUserBalance();
      if (response.success) {
        setBalance(response.data);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      Alert.alert('Error', 'Failed to load wallet balance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawalType = type => {
    switch (type.id) {
      case 'virtual_account':
        navigation.navigate('VirtualAccountWithdrawal', {balance});
        break;
      case 'crypto':
        navigation.navigate('CryptoWithdrawal', {balance});
        break;
      default:
        Alert.alert(
          'Coming Soon',
          'This withdrawal method is not available yet',
        );
    }
  };

  const formatCurrency = (amount, currency) => {
    return withdrawalService.formatCurrency(amount, currency);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-center px-4 py-4 relative">
          <TouchableOpacity
            className="absolute left-4 z-10"
            onPress={() => navigation.goBack()}>
            <ArrowLeftIcon size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-black text-lg font-semibold">Withdrawal</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4B39EF" />
          <Text className="text-gray-600 mt-4">Loading wallet balance...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">Withdrawal</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Balance Cards */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Available Balance
          </Text>

          <View className="flex-row space-x-4">
            {/* NGN Balance */}
            <View className="flex-1 bg-green-50 p-4 rounded-lg border border-green-200">
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">₦</Text>
                <Text className="text-green-600 text-sm font-medium">
                  Naira
                </Text>
              </View>
              <Text className="text-black text-xl font-bold">
                {formatCurrency(balance.naira_balance, 'NGN')}
              </Text>
            </View>

            {/* USD Balance */}
            <View className="flex-1 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">$</Text>
                <Text className="text-blue-600 text-sm font-medium">USD</Text>
              </View>
              <Text className="text-black text-xl font-bold">
                {formatCurrency(balance.usd_balance, 'USD')}
              </Text>
            </View>
          </View>
        </View>

        {/* Withdrawal Methods */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Withdrawal Methods
          </Text>

          {withdrawalTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              className="bg-white p-4 rounded-lg border border-gray-200 mb-3 shadow-sm"
              onPress={() => handleWithdrawalType(type)}
              style={{borderLeftWidth: 4, borderLeftColor: type.color}}>
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{backgroundColor: type.color + '20'}}>
                  <Text className="text-2xl">{type.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-black text-lg font-semibold">
                    {type.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {type.description}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-400 text-sm">
                    {withdrawalService.getProcessingTime(type.id)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Quick Actions
          </Text>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 items-center"
              onPress={() => navigation.navigate('WithdrawalHistory')}>
              <CreditCardIcon size={24} color="#6B7280" />
              <Text className="text-gray-600 text-sm mt-2 text-center">
                Transaction History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 items-center"
              onPress={() => navigation.navigate('WalletSettings')}>
              <CurrencyDollarIcon size={24} color="#6B7280" />
              <Text className="text-gray-600 text-sm mt-2 text-center">
                Wallet Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Information Section */}
        <View className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Text className="text-blue-800 text-sm font-semibold mb-2">
            💡 Withdrawal Information
          </Text>
          <Text className="text-blue-700 text-xs leading-5">
            • Virtual Account withdrawals are processed instantly{'\n'}• Crypto
            withdrawals may take 5-30 minutes{'\n'}• All withdrawals are subject
            to minimum amounts{'\n'}• Transaction fees may apply for crypto
            withdrawals
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Withdrawal;

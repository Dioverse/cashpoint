import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeftIcon, ArrowRightLeftIcon} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import withdrawalService from '../services/withdrawalService';

const VirtualAccountWithdrawal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {balance} = route.params || {
    balance: {naira_balance: 0, usd_balance: 0},
  };

  const [selectedAccount, setSelectedAccount] = useState('ngn');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate] = useState(1000); // Default exchange rate

  const accountTypes = [
    {
      id: 'ngn',
      name: 'Naira to USD',
      from: 'NGN',
      to: 'USD',
      balance: balance.naira_balance,
      icon: '₦',
      color: '#10B981',
    },
    {
      id: 'usd',
      name: 'USD to Naira',
      from: 'USD',
      to: 'NGN',
      balance: balance.usd_balance,
      icon: '$',
      color: '#3B82F6',
    },
  ];

  const selectedAccountType = accountTypes.find(
    acc => acc.id === selectedAccount,
  );

  const handleWithdrawal = async () => {
    // Validate amount
    const validation = withdrawalService.validateWithdrawalAmount(
      parseFloat(amount),
      selectedAccountType.from,
      selectedAccountType.balance,
    );

    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    // Show confirmation
    const conversion = withdrawalService.calculateConversion(
      parseFloat(amount),
      selectedAccountType.from,
      selectedAccountType.to,
      exchangeRate,
    );

    Alert.alert(
      'Confirm Withdrawal',
      `Convert ${withdrawalService.formatCurrency(
        conversion.originalAmount,
        selectedAccountType.from,
      )} to ${withdrawalService.formatCurrency(
        conversion.convertedAmount,
        selectedAccountType.to,
      )}?\n\nExchange Rate: 1 ${selectedAccountType.from} = ${exchangeRate} ${
        selectedAccountType.to
      }`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: processWithdrawal},
      ],
    );
  };

  const processWithdrawal = async () => {
    try {
      setIsLoading(true);

      const response = await withdrawalService.withdrawFromVirtualAccount({
        account: selectedAccount,
        amount: parseFloat(amount),
      });

      if (response.success) {
        Alert.alert(
          'Success',
          response.message || 'Withdrawal completed successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', response.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Withdrawal failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getConversionPreview = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return null;
    }

    const conversion = withdrawalService.calculateConversion(
      parseFloat(amount),
      selectedAccountType.from,
      selectedAccountType.to,
      exchangeRate,
    );

    return (
      <View className="bg-gray-50 p-4 rounded-lg mb-4">
        <Text className="text-gray-600 text-sm mb-2">Conversion Preview:</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-black font-semibold">
            {withdrawalService.formatCurrency(
              conversion.originalAmount,
              selectedAccountType.from,
            )}
          </Text>
          <ArrowRightLeftIcon size={16} color="#6B7280" />
          <Text className="text-black font-semibold">
            {withdrawalService.formatCurrency(
              conversion.convertedAmount,
              selectedAccountType.to,
            )}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs mt-2">
          Exchange Rate: 1 {selectedAccountType.from} = {exchangeRate}{' '}
          {selectedAccountType.to}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">
          Virtual Account Withdrawal
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Account Type Selection */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Select Conversion Type
          </Text>

          {accountTypes.map(account => (
            <TouchableOpacity
              key={account.id}
              className={`p-4 rounded-lg border-2 mb-3 ${
                selectedAccount === account.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedAccount(account.id)}>
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{backgroundColor: account.color + '20'}}>
                  <Text className="text-2xl">{account.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-black text-lg font-semibold">
                    {account.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Available:{' '}
                    {withdrawalService.formatCurrency(
                      account.balance,
                      account.from,
                    )}
                  </Text>
                </View>
                {selectedAccount === account.id && (
                  <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount Input */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Enter Amount
          </Text>

          <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">{selectedAccountType.icon}</Text>
              <Text className="text-gray-600 text-sm">
                Amount in {selectedAccountType.from}
              </Text>
            </View>
            <TextInput
              className="text-black text-2xl font-bold"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <Text className="text-gray-500 text-xs mt-1">
              Available:{' '}
              {withdrawalService.formatCurrency(
                selectedAccountType.balance,
                selectedAccountType.from,
              )}
            </Text>
          </View>
        </View>

        {/* Conversion Preview */}
        {getConversionPreview()}

        {/* Quick Amount Buttons */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Quick Amounts
          </Text>

          <View className="flex-row flex-wrap">
            {[25, 50, 75, 100].map(percentage => {
              const quickAmount =
                (selectedAccountType.balance * percentage) / 100;
              return (
                <TouchableOpacity
                  key={percentage}
                  className="bg-gray-100 px-4 py-2 rounded-lg mr-2 mb-2"
                  onPress={() => setAmount(quickAmount.toString())}>
                  <Text className="text-gray-700 text-sm">
                    {percentage}% (
                    {withdrawalService.formatCurrency(
                      quickAmount,
                      selectedAccountType.from,
                    )}
                    )
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Withdrawal Button */}
        <TouchableOpacity
          className={`p-4 rounded-lg mb-6 ${
            amount && parseFloat(amount) > 0 && !isLoading
              ? 'bg-blue-500'
              : 'bg-gray-300'
          }`}
          onPress={handleWithdrawal}
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold text-center">
              Process Withdrawal
            </Text>
          )}
        </TouchableOpacity>

        {/* Information */}
        <View className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <Text className="text-yellow-800 text-sm font-semibold mb-2">
            ⚠️ Important Information
          </Text>
          <Text className="text-yellow-700 text-xs leading-5">
            • Virtual account conversions are processed instantly{'\n'}•
            Exchange rates are updated regularly{'\n'}• No fees are charged for
            virtual account conversions{'\n'}• Minimum amount:{' '}
            {selectedAccountType.from === 'NGN' ? '₦100' : '$1'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VirtualAccountWithdrawal;

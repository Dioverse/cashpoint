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
import {
  ArrowLeftIcon,
  ClipboardDocumentIcon,
} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import withdrawalService from '../services/withdrawalService';

const CryptoWithdrawal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {balance} = route.params || {
    balance: {naira_balance: 0, usd_balance: 0},
  };

  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cryptoBalances, setCryptoBalances] = useState({});

  const supportedCryptos = withdrawalService.getSupportedCryptos();

  useEffect(() => {
    fetchCryptoBalances();
  }, []);

  const fetchCryptoBalances = async () => {
    try {
      const response = await withdrawalService.getCryptoWalletTransactions();
      if (response.success) {
        // Mock crypto balances - in real app, this would come from API
        setCryptoBalances({
          BTC: 0.5,
          USDT: 1000,
          ETH: 2.5,
          BNB: 50,
        });
      }
    } catch (error) {
      console.error('Error fetching crypto balances:', error);
    }
  };

  const handleWithdrawal = async () => {
    // Validate withdrawal data
    const validation = withdrawalService.validateCryptoWithdrawal({
      coin: selectedCrypto,
      to_address: walletAddress,
      amount: parseFloat(amount),
    });

    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    // Validate wallet address
    const addressValidation = withdrawalService.validateWalletAddress(
      walletAddress,
      selectedCrypto,
    );

    if (!addressValidation.isValid) {
      Alert.alert('Invalid Address', addressValidation.errors.join('\n'));
      return;
    }

    // Check balance
    const availableBalance = cryptoBalances[selectedCrypto] || 0;
    if (parseFloat(amount) > availableBalance) {
      Alert.alert(
        'Insufficient Balance',
        'You do not have enough crypto balance',
      );
      return;
    }

    // Show confirmation
    const fee = withdrawalService.getWithdrawalFees('crypto', selectedCrypto);
    const totalCalculation = withdrawalService.calculateTotalWithFees(
      parseFloat(amount),
      fee,
    );

    Alert.alert(
      'Confirm Crypto Withdrawal',
      `Send ${totalCalculation.baseAmount} ${selectedCrypto} to:\n${walletAddress}\n\nFee: ${totalCalculation.feeAmount} ${selectedCrypto}\nTotal: ${totalCalculation.totalAmount} ${selectedCrypto}`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: processWithdrawal},
      ],
    );
  };

  const processWithdrawal = async () => {
    try {
      setIsLoading(true);

      const response = await withdrawalService.withdrawCrypto({
        coin: selectedCrypto,
        to_address: walletAddress,
        amount: parseFloat(amount),
      });

      if (response.success) {
        Alert.alert(
          'Success',
          response.message || 'Crypto withdrawal initiated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', response.message || 'Crypto withdrawal failed');
      }
    } catch (error) {
      console.error('Crypto withdrawal error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Crypto withdrawal failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getWithdrawalPreview = () => {
    if (!amount || isNaN(parseFloat(amount)) || !walletAddress) {
      return null;
    }

    const fee = withdrawalService.getWithdrawalFees('crypto', selectedCrypto);
    const totalCalculation = withdrawalService.calculateTotalWithFees(
      parseFloat(amount),
      fee,
    );

    return (
      <View className="bg-gray-50 p-4 rounded-lg mb-4">
        <Text className="text-gray-600 text-sm mb-2">Withdrawal Preview:</Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Amount:</Text>
            <Text className="text-black font-semibold">
              {totalCalculation.baseAmount} {selectedCrypto}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Network Fee:</Text>
            <Text className="text-black font-semibold">
              {totalCalculation.feeAmount} {selectedCrypto}
            </Text>
          </View>
          <View className="flex-row justify-between border-t border-gray-200 pt-2">
            <Text className="text-gray-600 font-semibold">Total:</Text>
            <Text className="text-black font-bold">
              {totalCalculation.totalAmount} {selectedCrypto}
            </Text>
          </View>
        </View>
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
          Crypto Withdrawal
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Crypto Selection */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Select Cryptocurrency
          </Text>

          <View className="flex-row flex-wrap">
            {supportedCryptos.map(crypto => {
              const balance = cryptoBalances[crypto.symbol] || 0;
              return (
                <TouchableOpacity
                  key={crypto.symbol}
                  className={`p-4 rounded-lg border-2 mb-3 mr-3 flex-1 min-w-[45%] ${
                    selectedCrypto === crypto.symbol
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedCrypto(crypto.symbol)}>
                  <View className="items-center">
                    <Text className="text-3xl mb-2">{crypto.icon}</Text>
                    <Text className="text-black font-semibold">
                      {crypto.symbol}
                    </Text>
                    <Text className="text-gray-600 text-xs">{crypto.name}</Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      Balance: {balance} {crypto.symbol}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Wallet Address Input */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Destination Wallet Address
          </Text>

          <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <TextInput
              className="text-black text-base"
              placeholder={`Enter ${selectedCrypto} wallet address`}
              value={walletAddress}
              onChangeText={setWalletAddress}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity className="absolute top-4 right-4">
              <ClipboardDocumentIcon size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-xs mt-2">
            Make sure the address is correct. Transactions cannot be reversed.
          </Text>
        </View>

        {/* Amount Input */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Enter Amount
          </Text>

          <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">
                {supportedCryptos.find(c => c.symbol === selectedCrypto)?.icon}
              </Text>
              <Text className="text-gray-600 text-sm">
                Amount in {selectedCrypto}
              </Text>
            </View>
            <TextInput
              className="text-black text-2xl font-bold"
              placeholder="0.00000000"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <Text className="text-gray-500 text-xs mt-1">
              Available: {cryptoBalances[selectedCrypto] || 0} {selectedCrypto}
            </Text>
          </View>
        </View>

        {/* Withdrawal Preview */}
        {getWithdrawalPreview()}

        {/* Quick Amount Buttons */}
        <View className="mb-6">
          <Text className="text-black text-lg font-semibold mb-4">
            Quick Amounts
          </Text>

          <View className="flex-row flex-wrap">
            {[25, 50, 75, 100].map(percentage => {
              const availableBalance = cryptoBalances[selectedCrypto] || 0;
              const quickAmount = (availableBalance * percentage) / 100;
              return (
                <TouchableOpacity
                  key={percentage}
                  className="bg-gray-100 px-4 py-2 rounded-lg mr-2 mb-2"
                  onPress={() => setAmount(quickAmount.toString())}>
                  <Text className="text-gray-700 text-sm">
                    {percentage}% ({quickAmount.toFixed(8)} {selectedCrypto})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Withdrawal Button */}
        <TouchableOpacity
          className={`p-4 rounded-lg mb-6 ${
            amount && parseFloat(amount) > 0 && walletAddress && !isLoading
              ? 'bg-orange-500'
              : 'bg-gray-300'
          }`}
          onPress={handleWithdrawal}
          disabled={
            !amount || parseFloat(amount) <= 0 || !walletAddress || isLoading
          }>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold text-center">
              Send {selectedCrypto}
            </Text>
          )}
        </TouchableOpacity>

        {/* Information */}
        <View className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <Text className="text-red-800 text-sm font-semibold mb-2">
            ⚠️ Important Security Notice
          </Text>
          <Text className="text-red-700 text-xs leading-5">
            • Double-check the wallet address before confirming{'\n'}• Crypto
            transactions are irreversible{'\n'}• Network fees will be deducted
            from your balance{'\n'}• Processing time: 5-30 minutes depending on
            network{'\n'}• Minimum withdrawal: 0.0001 {selectedCrypto}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CryptoWithdrawal;

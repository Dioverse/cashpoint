import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import cryptoService from '../services/cryptoService';

const BuyCryptoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {coin} = route.params || {};

  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentRate, setCurrentRate] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(coin || null);

  useEffect(() => {
    if (selectedCoin) {
      fetchCurrentRate();
    }
  }, [selectedCoin]);

  const fetchCurrentRate = async () => {
    try {
      const response = await cryptoService.getCryptoRates();
      if (response.status && response.results?.data) {
        const rate =
          response.results.data[selectedCoin.symbol] || selectedCoin.usd_rate;
        setCurrentRate(rate);
      }
    } catch (error) {
      console.error('Error fetching rate:', error);
      setCurrentRate(selectedCoin?.usd_rate || 0);
    }
  };

  const calculateCryptoAmount = () => {
    const usdAmount = parseFloat(amount);
    if (!isNaN(usdAmount) && currentRate > 0) {
      return (usdAmount / currentRate).toFixed(8);
    }
    return '0.00000000';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!amount || isNaN(amount) || parseFloat(amount) < 10) {
      newErrors.amount = 'Amount must be at least $10';
    }
    if (!walletAddress || walletAddress.trim().length < 10) {
      newErrors.walletAddress = 'Please enter a valid wallet address';
    }
    if (!selectedCoin) {
      newErrors.coin = 'Please select a cryptocurrency';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const buyData = {
        crypto_id: selectedCoin.id,
        amount_usd: parseFloat(amount),
        wallet_address: walletAddress.trim(),
      };

      const response = await cryptoService.buyCrypto(buyData);

      if (response.status) {
        Alert.alert(
          'Success',
          'Your crypto buy order has been submitted successfully. The cryptocurrency will be sent to your wallet address.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit buy order');
      }
    } catch (error) {
      console.error('Buy crypto error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to submit buy order. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.headerText}>
              Buy {selectedCoin?.symbol || 'Crypto'}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formWrapper}>
          <View style={styles.formSection}>
            {/* Selected Coin Display */}
            {selectedCoin && (
              <View
                style={{
                  marginBottom: 25,
                  backgroundColor: '#f0f0f0',
                  padding: 15,
                  borderRadius: 8,
                }}>
                <Text style={styles.label}>Selected Cryptocurrency</Text>
                <Text style={styles.coinText}>
                  {selectedCoin.symbol} - {selectedCoin.name}
                </Text>
                <Text style={styles.rateText}>
                  Current Rate: {cryptoService.formatUSDAmount(currentRate)}
                </Text>
              </View>
            )}

            {/* Amount in USD */}
            <View style={{marginBottom: 25}}>
              <Text style={styles.label}>Amount (USD)</Text>
              <TextInput
                style={[styles.input, errors.amount && {borderColor: 'red'}]}
                placeholder="Enter amount in USD (minimum $10)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={amount}
                onChangeText={text => {
                  setAmount(text);
                  if (errors.amount) setErrors({...errors, amount: null});
                }}
              />
              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
            </View>

            {/* Wallet Address */}
            <View style={{marginBottom: 25}}>
              <Text style={styles.label}>Your Wallet Address</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.walletAddress && {borderColor: 'red'},
                ]}
                placeholder="Enter your wallet address"
                placeholderTextColor="#9CA3AF"
                value={walletAddress}
                onChangeText={text => {
                  setWalletAddress(text);
                  if (errors.walletAddress)
                    setErrors({...errors, walletAddress: null});
                }}
                multiline
                numberOfLines={3}
              />
              {errors.walletAddress && (
                <Text style={styles.errorText}>{errors.walletAddress}</Text>
              )}
            </View>

            {/* Current Rate Display */}
            <View
              style={{
                marginBottom: 25,
                backgroundColor: '#3432a830',
                padding: 12,
                borderRadius: 8,
              }}>
              <Text style={styles.label}>Current Rate</Text>
              <Text style={styles.rateDisplay}>
                {cryptoService.formatUSDAmount(currentRate)} per{' '}
                {selectedCoin?.symbol || 'unit'}
              </Text>
            </View>

            {/* You Will Receive */}
            <View
              style={{
                marginBottom: 30,
                backgroundColor: '#3432a830',
                padding: 12,
                borderRadius: 8,
              }}>
              <Text style={styles.label}>You Will Receive</Text>
              <View style={styles.input}>
                <Text style={styles.valueText}>
                  {calculateCryptoAmount()} {selectedCoin?.symbol || 'crypto'}
                </Text>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  Buy {selectedCoin?.symbol || 'Crypto'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4B39EF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  coinText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginTop: 5,
  },
  rateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rateDisplay: {
    fontSize: 16,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
});

export default BuyCryptoScreen;

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

const SellCryptoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {coin} = route.params || {};

  const [amount, setAmount] = useState('');
  const [creditRate, setCreditRate] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [currentRate, setCurrentRate] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(coin || null);

  useEffect(() => {
    if (selectedCoin) {
      fetchCurrentRate();
    }
  }, [selectedCoin]);

  const fetchCurrentRate = async () => {
    try {
      setIsLoadingRate(true);
      const response = await cryptoService.getCryptoRates();
      console.log('Rate response:', response);

      // Handle different response formats
      let rate = selectedCoin?.usd_rate || 0;

      if (response.status && response.results?.data) {
        rate =
          response.results.data[selectedCoin.symbol] || selectedCoin.usd_rate;
      } else if (response.results?.data) {
        rate =
          response.results.data[selectedCoin.symbol] || selectedCoin.usd_rate;
      } else if (response.data) {
        rate = response.data[selectedCoin.symbol] || selectedCoin.usd_rate;
      }

      setCurrentRate(rate);
      setCreditRate(rate.toString());
      console.log('Set current rate to:', rate);
    } catch (error) {
      console.error('Error fetching rate:', error);
      const fallbackRate = selectedCoin?.usd_rate || 0;
      setCurrentRate(fallbackRate);
      setCreditRate(fallbackRate.toString());
    } finally {
      setIsLoadingRate(false);
    }
  };

  const calculateYouReceive = () => {
    const amt = parseFloat(amount);
    const rate = parseFloat(creditRate);
    if (!isNaN(amt) && !isNaN(rate)) {
      return (amt * rate).toFixed(2);
    }
    return '0.00';
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate amount
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(amount) < 0.001) {
      newErrors.amount = 'Amount must be at least 0.001';
    }

    // Validate selected coin
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

      const sellData = {
        crypto_id: selectedCoin.id,
        amount_crypto: parseFloat(amount),
      };

      console.log('Submitting sell order with data:', sellData);
      const response = await cryptoService.sellCrypto(sellData);
      console.log('Sell order response:', response);

      // Handle different response formats
      if (response.status || response.success) {
        Alert.alert(
          'Success',
          "Your crypto sell order has been submitted successfully. You will be notified when it's processed.",
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit sell order');
      }
    } catch (error) {
      console.error('Sell crypto error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit sell order. Please try again.',
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
              Sell {selectedCoin?.symbol || 'Crypto'}
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
                  Current Rate:{' '}
                  {isLoadingRate
                    ? 'Loading...'
                    : cryptoService.formatUSDAmount(currentRate)}
                </Text>
              </View>
            )}

            {/* Amount */}
            <View style={{marginBottom: 25}}>
              <Text style={styles.label}>
                Amount ({selectedCoin?.symbol || 'Crypto'})
              </Text>
              <TextInput
                style={[styles.input, errors.amount && {borderColor: 'red'}]}
                placeholder={`Enter amount in ${
                  selectedCoin?.symbol || 'crypto'
                }`}
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
                {isLoadingRate
                  ? 'Loading...'
                  : cryptoService.formatUSDAmount(currentRate)}{' '}
                per {selectedCoin?.symbol || 'unit'}
              </Text>
            </View>

            {/* You Receive */}
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
                  {cryptoService.formatUSDAmount(calculateYouReceive())}
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
                  Sell {selectedCoin?.symbol || 'Crypto'}
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
  inputGray: {
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 16,
    color: '#4A4A4A',
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

export default SellCryptoScreen;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentRate, setCurrentRate] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(coin || null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  useEffect(() => {
    if (selectedCoin) {
      fetchCurrentRate();
    }
  }, [selectedCoin]);

  const fetchCurrentRate = async () => {
    try {
      setIsLoadingRate(true);
      const response = await cryptoService.getCryptoRates();

      let rate = selectedCoin?.usd_rate || 0;
      if (response.status && response.results?.data) {
        rate =
          response.results.data[selectedCoin.symbol] || selectedCoin.usd_rate;
      }
      setCurrentRate(rate);
    } catch {
      setCurrentRate(selectedCoin?.usd_rate || 0);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const calculateYouReceive = () => {
    const amt = parseFloat(amount);
    const rate = parseFloat(currentRate);
    return !isNaN(amt) && !isNaN(rate) ? (amt * rate).toFixed(2) : '0.00';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(amount) < 0.001) {
      newErrors.amount = 'Amount must be at least 0.001';
    }
    if (!selectedCoin) newErrors.coin = 'Please select a cryptocurrency';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSell = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);

      // First create the wallet
      const walletRes = await cryptoService.createWallet({coin: selectedCoin.symbol});
      if (!walletRes.status || !walletRes.results?.data) {
        throw new Error(walletRes.message || 'Wallet creation failed');
      }

      // Then fetch the deposit address
      const depositRes = await cryptoService.getDepositAddress({
        blockchain: selectedCoin.symbol.toLowerCase(),
      });

      if (!depositRes.status || !depositRes.results?.address) {
        throw new Error(depositRes.message || 'Deposit address not available');
      }

      navigation.navigate('QRDepositScreen', {
        coin: selectedCoin,
        amount,
        rate: currentRate,
        youReceive: calculateYouReceive(),
        wallet: walletRes.results.data,
        depositAddress: depositRes.results.address,
      });
    } catch (err) {
      Alert.alert('Error', err.message);
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            Sell {selectedCoin?.symbol || 'Crypto'}
          </Text>
        </View>

        <ScrollView
          style={styles.formWrapper}
          contentContainerStyle={{paddingBottom: 40}}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formSection}>
            {selectedCoin && (
              <View style={styles.infoBox}>
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

            <View style={{marginBottom: 25}}>
              <Text style={styles.label}>
                Amount ({selectedCoin?.symbol || 'Crypto'})
              </Text>
              <TextInput
                style={[styles.input, errors.amount && {borderColor: 'red'}]}
                placeholder={`Enter amount in ${selectedCoin?.symbol}`}
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

            <View style={styles.displayBox}>
              <Text style={styles.label}>You Will Receive</Text>
              <Text style={styles.valueText}>
                {cryptoService.formatUSDAmount(calculateYouReceive())}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSell}
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  Continue to Sell {selectedCoin?.symbol}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginLeft: 12,
  },
  formWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
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
  displayBox: {
    marginBottom: 25,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
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
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  infoBox: {
    marginBottom: 25,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
  },
});

export default SellCryptoScreen;

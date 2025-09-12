import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import cryptoService from '../services/cryptoService';

// Custom Select Dropdown Component
const CustomSelect = ({options, selectedValue, onValueChange, placeholder}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleSelect = value => {
    onValueChange(value);
    setDropdownVisible(false);
  };

  return (
    <View style={dropdownStyles.wrapper}>
      <TouchableOpacity
        style={dropdownStyles.selectButton}
        onPress={() => setDropdownVisible(prev => !prev)}
        activeOpacity={0.8}>
        <Text style={dropdownStyles.selectText}>
          {selectedValue || placeholder}
        </Text>
        <Icon name="caret-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={dropdownStyles.dropdown}>
          {options.map((item, index) => (
            <Pressable
              key={index}
              onPressIn={() => setHoveredIndex(index)}
              onPressOut={() => setHoveredIndex(null)}
              onPress={() => handleSelect(item)}
              style={[
                dropdownStyles.option,
                hoveredIndex === index && dropdownStyles.optionHovered,
              ]}>
              <Text
                style={[
                  dropdownStyles.optionText,
                  hoveredIndex === index && dropdownStyles.optionTextHovered,
                ]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const WalletFundCryptoScreen = () => {
  const navigation = useNavigation();

  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [expiresIn, setExpiresIn] = useState('10:05');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({});
  const [cryptoTypes, setCryptoTypes] = useState([]);

  const wallets = cryptoTypes.map(crypto => ({
    label: crypto.name,
    value: crypto.symbol,
    id: crypto.id,
  }));

  useEffect(() => {
    fetchCryptoTypes();
  }, []);

  const fetchCryptoTypes = async () => {
    try {
      const response = await cryptoService.getCryptoTypes();
      if (response.success) {
        setCryptoTypes(
          response.results.data.filter(crypto => crypto.is_active),
        );
      }
    } catch (error) {
      console.error('Error fetching crypto types:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!wallet) {
      newErrors.wallet = 'Please select a wallet type';
    }
    if (!amount || isNaN(amount) || parseFloat(amount) < 1) {
      newErrors.amount = 'Please enter a valid amount (minimum ₦1)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateWalletAddress = async () => {
    if (!validateForm()) return;

    try {
      setIsGenerating(true);

      const selectedCrypto = cryptoTypes.find(
        crypto => crypto.symbol === wallet,
      );
      if (!selectedCrypto) {
        Alert.alert('Error', 'Please select a valid cryptocurrency');
        return;
      }

      const walletData = {
        coin: wallet,
        amount_ngn: parseFloat(amount),
      };

      const response = await cryptoService.generateWalletAddress(walletData);

      if (response.success) {
        setWalletAddress(response.results.wallet.address);
        setConversionRate(
          `${cryptoService.formatNGNAmount(
            amount,
          )} ≈ ${cryptoService.formatUSDAmount(
            response.results.usd_equivalent,
          )} ${wallet}`,
        );

        // Start countdown timer
        startCountdown();
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to generate wallet address',
        );
      }
    } catch (error) {
      console.error('Generate wallet address error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to generate wallet address. Please try again.',
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const startCountdown = () => {
    let timeLeft = 15 * 60; // 15 minutes in seconds
    const timer = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      setExpiresIn(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      if (timeLeft <= 0) {
        clearInterval(timer);
        setWalletAddress('');
        setExpiresIn('00:00');
      }
      timeLeft--;
    }, 1000);
  };

  const copyAddress = () => {
    if (walletAddress) {
      // You can use Clipboard API here if available
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#4B39EF'}}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Wallet Fund With Crypto</Text>
          </View>
        </View>

        {/* Main Body */}
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          {/* Select Wallet */}
          <Text style={styles.label}>Select Wallet</Text>
          <CustomSelect
            options={wallets.map(w => w.label)}
            selectedValue={wallets.find(w => w.value === wallet)?.label || ''}
            onValueChange={label => {
              const selectedWallet = wallets.find(w => w.label === label);
              setWallet(selectedWallet?.value || '');
              if (errors.wallet) setErrors({...errors, wallet: null});
            }}
            placeholder="Select Wallet"
          />
          {errors.wallet && (
            <Text style={styles.errorText}>{errors.wallet}</Text>
          )}

          {/* Amount */}
          <Text style={styles.label}>Amount (NGN)</Text>
          <TextInput
            style={[styles.input, errors.amount && {borderColor: 'red'}]}
            keyboardType="numeric"
            value={amount}
            onChangeText={text => {
              setAmount(text);
              if (errors.amount) setErrors({...errors, amount: null});
            }}
            placeholder="Enter amount in NGN"
          />
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}

          {/* Conversion Rate Display */}
          {conversionRate && (
            <View
              style={{
                backgroundColor: '#3432a830',
                padding: 12,
                borderRadius: 8,
                marginBottom: 25,
              }}>
              <Text style={styles.label}>Conversion Rate</Text>
              <Text style={styles.conversionText}>{conversionRate}</Text>
            </View>
          )}

          {/* Generate Wallet Button */}
          <TouchableOpacity
            style={[
              styles.generateButton,
              isGenerating && styles.generateButtonDisabled,
            ]}
            onPress={generateWalletAddress}
            disabled={isGenerating}>
            {isGenerating ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.generateButtonText}>
                Generate Wallet Address
              </Text>
            )}
          </TouchableOpacity>

          {/* QR Text */}
          <Text style={styles.scanText}>Scan QR code</Text>

          {/* QR Code */}
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/250px-QR_code_for_mobile_English_Wikipedia.svg.png',
            }}
            style={styles.qrImage}
          />

          {/* Wallet Address */}
          {walletAddress !== '' && (
            <View style={styles.addressContainer}>
              <Pressable style={styles.copyWrapper} onPress={copyAddress}>
                <Icon name="copy-outline" size={30} color="#4B39EF" />
                <Text style={styles.copyText} className="p-2 rounded-5">
                  {walletAddress}
                </Text>
              </Pressable>
              <Text style={styles.expiresText}>Expires in: {expiresIn}</Text>
            </View>
          )}

          {/* Instruction */}
          <Text style={styles.paymentInstruction}>
            Payment should be made within 15 minutes
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#4B39EF',
    paddingBottom: 30,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 24,
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // marginTop: -20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#4A4A4A',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  generateButton: {
    backgroundColor: '#3432a830',
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  generateButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  scanText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
    color: '#4A4A4A',
  },
  qrImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addressContainer: {
    // backgroundColor: '#3432a830',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  copyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  copyText: {
    marginLeft: 8,
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
    backgroundColor: '#3432a830',
  },
  expiresText: {
    fontSize: 13,
    color: '#555',
  },
  paymentInstruction: {
    textAlign: 'center',
    fontSize: 13,
    color: '#000',
    marginTop: 3,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  conversionText: {
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  generateButtonDisabled: {
    backgroundColor: '#999',
  },
});

// Dropdown Styles
const dropdownStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    zIndex: 10,
  },
  selectButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#999',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    color: '#000',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 1001,
    elevation: 8,
  },
  option: {
    padding: 12,
  },
  optionHovered: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    color: '#000',
  },
  optionTextHovered: {
    color: '#1e90ff',
  },
});

export default WalletFundCryptoScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { cryptoAPI, giftcardAPI } from '../services/apiServices';

// Custom Select Component
const CustomSelect = ({ options, onValueChange, selectedValue, placeholder }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <View style={styles.selectWrapper}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.selectText}>
          {selectedValue || placeholder || 'Select'}
        </Text>
        <Icon name="chevron-down" size={20} color="#555" />
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                onValueChange(item);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const RateCalculatorScreen = () => {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('Giftcard');
  const [giftcardRates, setGiftcardRates] = useState({});
  const [cryptoRates, setCryptoRates] = useState({});

  const [selectedGiftcard, setSelectedGiftcard] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');

  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [total, setTotal] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');

  // Fetch rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const [giftRes, cryptoRes] = await Promise.all([
          giftcardAPI.getRates(),
          cryptoAPI.getRates(),
        ]);

        if (giftRes.success) setGiftcardRates(giftRes.data.results.data || {});
        if (cryptoRes.success) setCryptoRates(cryptoRes.data.results.data || {});
      } catch (err) {
        console.error('Failed to fetch rates:', err);
      }
    };

    fetchRates();
  }, []);

  // Update rate & total/cryptoAmount when selection or amount changes
  useEffect(() => {
    let selectedRate = '';
    if (activeTab === 'Giftcard' && selectedGiftcard) {
      selectedRate = giftcardRates[selectedGiftcard];
    } else if (activeTab === 'Crypto' && selectedCrypto) {
      selectedRate = cryptoRates[selectedCrypto];
    }

    setRate(selectedRate || '');

    if (selectedRate && amount) {
      const rateValue = parseFloat(selectedRate);
      const amountValue = parseFloat(amount);

      if (!isNaN(rateValue) && !isNaN(amountValue)) {
        if (activeTab === 'Giftcard') {
          const totalNaira = amountValue * rateValue;
          setTotal(totalNaira.toFixed(2));
          setCryptoAmount('');
        } else if (activeTab === 'Crypto') {
          const cryptoAmt = amountValue / rateValue;
          setCryptoAmount(cryptoAmt.toFixed(6));
          setTotal('');
        }
      } else {
        setTotal('');
        setCryptoAmount('');
      }
    } else {
      setTotal('');
      setCryptoAmount('');
    }
  }, [selectedGiftcard, selectedCrypto, amount, activeTab]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4B39EF' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Rate Calculator</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {['Giftcard', 'Crypto'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => {
                  setActiveTab(tab);
                  setAmount('');
                  setTotal('');
                  setRate('');
                  setCryptoAmount('');
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab ? styles.activeText : styles.inactiveText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'Giftcard' ? (
            <>
              <Text style={styles.label}>Giftcard</Text>
              <CustomSelect
                options={Object.keys(giftcardRates)}
                selectedValue={selectedGiftcard}
                onValueChange={setSelectedGiftcard}
                placeholder="Select Giftcard"
              />

              <Text style={styles.label}>Rate ($)</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={rate}
                editable={false}
                placeholder="Rate"
              />

              <Text style={styles.label}>Amount (Giftcard)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
              />

              <Text style={styles.label}>Total ($)</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={total}
                editable={false}
                placeholder="Total in $"
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Crypto</Text>
              <CustomSelect
                options={Object.keys(cryptoRates)}
                selectedValue={selectedCrypto}
                onValueChange={setSelectedCrypto}
                placeholder="Select Coin"
              />

              <Text style={styles.label}>Rate ($)</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={rate}
                editable={false}
                placeholder="Rate"
              />

              <Text style={styles.label}>Amount ($)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount in USD"
              />

              <Text style={styles.label}>Crypto Amount</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={cryptoAmount}
                editable={false}
                placeholder="Calculated crypto amount"
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#4B39EF',
    paddingBottom: 20,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  inactiveTab: {
    backgroundColor: '#6D5FFD',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#4B39EF',
  },
  inactiveText: {
    color: 'white',
  },
  body: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
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
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#999',
  },
  selectWrapper: {
    marginBottom: 20,
    position: 'relative',
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
    color: '#000',
    fontSize: 14,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownItemText: {
    color: '#000',
  },
});

export default RateCalculatorScreen;

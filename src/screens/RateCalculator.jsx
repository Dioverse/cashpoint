import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Custom Select Component
const CustomSelect = ({ options, onValueChange, selectedValue, placeholder }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleSelect = (value) => {
    onValueChange(value);
    setDropdownVisible(false);
  };

  return (
    <View style={dropdownStyles.wrapper}>
      <TouchableOpacity
        style={dropdownStyles.selectButton}
        onPress={() => setDropdownVisible((prev) => !prev)}
        activeOpacity={0.8}
      >
        <Text style={dropdownStyles.selectText}>{selectedValue || placeholder || 'Select'}</Text>
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
              ]}
            >
              <Text
                style={[
                  dropdownStyles.optionText,
                  hoveredIndex === index && dropdownStyles.optionTextHovered,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const RateCalculatorScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Giftcard Rate');
  const [country, setCountry] = useState('');
  const [giftCard, setGiftCard] = useState('');
  const [cardType, setCardType] = useState('');
  const [cardCategory, setCardCategory] = useState('');
  const [rate, setRate] = useState('');
  const [amount, setAmount] = useState('');
  const [coin, setCoin] = useState('');
  const [cryptoRate, setCryptoRate] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');

  const countries = ['USA', 'UK', 'Canada'];
  const giftcards = ['Amazon', 'Steam', 'iTunes'];
  const cardTypes = ['E-code', 'Physical'];
  const cardCategories = ['Category A', 'Category B', 'Category C'];
  const coins = ['Bitcoin', 'Ethereum', 'USDT'];

  // Validation function for enabling submit button
  const isGiftcardFormComplete = () => {
    return (
      country.trim() !== '' &&
      giftCard.trim() !== '' &&
      cardType.trim() !== '' &&
      cardCategory.trim() !== '' &&
      rate.trim() !== '' &&
      amount.trim() !== ''
    );
  };

  const isCryptoFormComplete = () => {
    return coin.trim() !== '' && cryptoAmount.trim() !== '' && cryptoRate.trim() !== '';
  };

  // Handler for submit button press
  const handleSubmit = () => {
    if (activeTab === 'Giftcard Rate') {
      console.log({
        country,
        giftCard,
        cardType,
        cardCategory,
        rate,
        amount,
      });
    } else {
      console.log({
        coin,
        cryptoAmount,
        cryptoRate,
        calculatedNairaValue:
          cryptoAmount && cryptoRate
            ? (parseFloat(cryptoAmount) * parseFloat(cryptoRate)).toFixed(2)
            : '',
      });
    }
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = activeTab === 'Giftcard Rate' ? !isGiftcardFormComplete() : !isCryptoFormComplete();

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

          {/* Pills */}
          <View style={styles.tabRow}>
            {['Giftcard Rate', 'Crypto Rate'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab(tab)}
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
          nestedScrollEnabled
        >
          {activeTab === 'Giftcard Rate' ? (
            <>
              <View style={{ zIndex: 5 }}>
                <Text style={styles.label}>Country</Text>
                <CustomSelect
                  options={countries}
                  selectedValue={country}
                  onValueChange={setCountry}
                  placeholder="Select Country"
                />
              </View>

              <View style={{ zIndex: 4 }}>
                <Text style={styles.label}>Gift Card</Text>
                <CustomSelect
                  options={giftcards}
                  selectedValue={giftCard}
                  onValueChange={setGiftCard}
                  placeholder="Select Gift Card"
                />
              </View>

              <View style={{ zIndex: 3 }}>
                <Text style={styles.label}> Card Type</Text>
                <CustomSelect
                  options={cardTypes}
                  selectedValue={cardType}
                  onValueChange={setCardType}
                  placeholder="Select Card Type"
                />
              </View>

              <View style={{ zIndex: 2 }}>
                <Text style={styles.label}>Card Category</Text>
                <CustomSelect
                  options={cardCategories}
                  selectedValue={cardCategory}
                  onValueChange={setCardCategory}
                  placeholder="Select Card Category"
                />
              </View>
                <View style={{ backgroundColor: '#3432a830', padding: 12, borderRadius: 8,marginBottom: 25 }}>

                    <Text style={styles.label}>Current Rate</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={rate}
                        onChangeText={setRate}
                        placeholder="Rate"
                    />
                </View>

              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Amount"
              />
            </>
          ) : (
            <>
              <View style={{ zIndex: 5 }}>
                <Text style={styles.label}>Coin</Text>
                <CustomSelect
                  options={coins}
                  selectedValue={coin}
                  onValueChange={setCoin}
                  placeholder="Select Coin"
                />
              </View>

              <Text style={styles.label}>Amount (USD)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={cryptoAmount}
                onChangeText={setCryptoAmount}
                placeholder="USD"
              />
              <View style={{ backgroundColor: '#3432a830', padding: 12, borderRadius: 8,marginBottom: 25 }}>
                <Text style={styles.label}>Current Rate</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={cryptoRate}
                    onChangeText={setCryptoRate}
                    placeholder="₦ rate"
                />
              </View>

              <Text style={styles.label}>Amount (₦)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#f3f4f6' }]}
                editable={false}
                value={
                  cryptoAmount && cryptoRate
                    ? (parseFloat(cryptoAmount) * parseFloat(cryptoRate)).toFixed(2)
                    : ''
                }
                placeholder="₦ value"
              />
            </>
          )}
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
          disabled={isSubmitDisabled}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    justifyContent: 'space-around',
    marginTop: 8,
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeTab: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  inactiveTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: 'white',
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
  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#555',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const dropdownStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 30,
    position: 'relative',
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

export default RateCalculatorScreen;

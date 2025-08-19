// BuyGiftCardScreen.js

import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { giftcardAPI } from '../services/apiServices'; // API service
const loadingImage = require('../assets/images/1.png');

const CustomSelect = ({ options, onValueChange, selectedValue, placeholder, disabled }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleSelect = (value) => {
    onValueChange(value);
    setDropdownVisible(false);
  };

  return (
    <View style={dropdownStyles.wrapper}>
      <TouchableOpacity
        style={[dropdownStyles.selectButton, disabled && { backgroundColor: '#f0f0f0' }]}
        onPress={() => setDropdownVisible((prev) => !prev)}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Text style={[dropdownStyles.selectText, !selectedValue && { color: '#9CA3AF' }]}>
          {selectedValue || placeholder || 'Select'}
        </Text>
        <Icon name="caret-down" size={20} color="#6B7280" style={dropdownStyles.icon} />
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

const BuyGiftCardScreen = () => {
  const navigation = useNavigation();

  const [country, setCountry] = useState('');
  const [giftCard, setGiftCard] = useState('');
  const [selectedGiftCardCategory, setSelectedGiftCardCategory] = useState('');
  const [creditUnit, setCreditUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTypes, setIsFetchingTypes] = useState(true);
  const [fetchedGiftCardTypes, setFetchedGiftCardTypes] = useState([]);

  const zoomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(zoomAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(zoomAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      zoomAnim.stopAnimation();
      zoomAnim.setValue(0);
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchTypes = async () => {
      setIsFetchingTypes(true);
      try {
        const result = await giftcardAPI.getTypes();
        if (result.success && result.data?.results?.data) {
          setFetchedGiftCardTypes(result.data.results.data); // store full gift card objects
        } else {
          Alert.alert('Error', result.error || 'Failed to fetch gift card types.');
        }
      } catch (error) {
        console.error('Error fetching gift card types:', error);
        Alert.alert('Error', 'Network error while fetching gift card types.');
      } finally {
        setIsFetchingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  const countryOptions = ['USA', 'UK', 'Canada', 'Germany', 'Australia'];
  const creditUnitOptions = ['$5', '$10', '$25', '$50', '$100'];

  const calculateAmount = () => {
    const unitValue = Number(creditUnit.replace(/\$/g, ''));
    const qty = Number(quantity);
    if (!isNaN(unitValue) && !isNaN(qty) && qty > 0) {
      return (unitValue * qty).toFixed(2);
    }
    return '0.00';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!country) newErrors.country = 'Please select a country.';
    if (!giftCard) newErrors.giftCard = 'Please select a gift card.';
    if (!creditUnit) newErrors.creditUnit = 'Please select a credit unit.';
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0 || !Number.isInteger(Number(quantity))) {
      newErrors.quantity = 'Please enter a valid whole number quantity greater than 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const amount = calculateAmount();
      const payload = {
        country,
        card_type: giftCard,
        category: selectedGiftCardCategory,
        credit_unit: creditUnit.replace(/\$/g, ''),
        quantity: Number(quantity),
        amount: Number(amount),
      };

      const result = await giftcardAPI.buy(payload);

      if (result.success) {
        Alert.alert('Success', result.data.message || 'Gift Card purchase submitted successfully!');
        setCountry('');
        setGiftCard('');
        setSelectedGiftCardCategory('');
        setCreditUnit('');
        setQuantity('');
        navigation.navigate('Transaction');
      } else {
        Alert.alert('Purchase Failed', result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Buy Gift Card error:', error);
      Alert.alert('Error', 'Network error or unexpected issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerText}>Buy Gift Card</Text>
          </View>
        </View>

        <View style={styles.formWrapper}>
          <View style={styles.formSection}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
              {/* Country */}
              <View style={{ marginBottom: 25, zIndex: 5 }}>
                <Text style={styles.label}>Country</Text>
                <CustomSelect
                  options={countryOptions}
                  selectedValue={country}
                  onValueChange={setCountry}
                  placeholder="Select country"
                  disabled={isLoading}
                />
                {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
              </View>

              {/* Gift Card */}
              <View style={{ marginBottom: 25, zIndex: 4 }}>
                <Text style={styles.label}>Gift Card</Text>
                {isFetchingTypes ? (
                  <View style={[styles.input, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                    <ActivityIndicator size="small" color="#4B39EF" />
                    <Text style={{ color: '#6B7280', marginLeft: 10 }}>Loading types...</Text>
                  </View>
                ) : (
                  <CustomSelect
                    options={fetchedGiftCardTypes.map(item => item.name)}
                    selectedValue={giftCard}
                    onValueChange={(name) => {
                      setGiftCard(name);
                      const selected = fetchedGiftCardTypes.find(item => item.name === name);
                      setSelectedGiftCardCategory(selected?.category || '');
                    }}
                    placeholder="Select gift card"
                    disabled={isLoading}
                  />
                )}
                {errors.giftCard && <Text style={styles.errorText}>{errors.giftCard}</Text>}
              </View>

              {/* Credit Unit */}
              <View style={{ marginBottom: 25, zIndex: 3 }}>
                <Text style={styles.label}>Credit Unit</Text>
                <CustomSelect
                  options={creditUnitOptions}
                  selectedValue={creditUnit}
                  onValueChange={setCreditUnit}
                  placeholder="Select credit unit"
                  disabled={isLoading}
                />
                {errors.creditUnit && <Text style={styles.errorText}>{errors.creditUnit}</Text>}
              </View>

              {/* Quantity */}
              <View style={{ marginBottom: 25, zIndex: 2 }}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={[styles.inputGray, errors.quantity && { borderColor: 'red' }]}
                  placeholder="Enter gift quantity"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={(text) => {
                    setQuantity(text);
                    if (errors.quantity) setErrors({ ...errors, quantity: null });
                  }}
                  editable={!isLoading}
                />
                {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
              </View>

              {/* Amount */}
              <View style={{ marginBottom: 30 }}>
                <Text style={styles.label}>Amount</Text>
                <View style={styles.input}>
                  <Text style={styles.valueText}>${calculateAmount()}</Text>
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.submitButton, isLoading && { backgroundColor: '#A0A0A0' }]}
                disabled={isLoading || isFetchingTypes}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Processing...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <Modal transparent={true} animationType="fade" visible={isLoading} onRequestClose={() => {}}>
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Processing Purchase...</Text>
        </View>
      </Modal>
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
    overflow: 'visible',
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
    borderColor: '#ccc',
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
    marginTop: 20,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 150,
    height: 150,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const dropdownStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 10,
    position: 'relative',
    zIndex: 999,
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
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
export default BuyGiftCardScreen;

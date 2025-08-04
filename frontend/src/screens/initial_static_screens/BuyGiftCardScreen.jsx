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
        <Text style={dropdownStyles.selectText}>
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
  const [creditUnit, setCreditUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});

  const countryOptions = ['USA', 'UK', 'Canada', 'Germany', 'Australia'];
  const giftCardOptions = ['Amazon', 'iTunes', 'Steam', 'PlayStation', 'Netflix'];
  const creditUnitOptions = ['$5', '$10', '$25', '$50', '$100'];

  const calculateAmount = () => {
    const unitValue = Number(creditUnit.replace(/\$/g, ''));
    const qty = Number(quantity);
    if (!isNaN(unitValue) && !isNaN(qty)) {
      return (unitValue * qty).toFixed(2);
    }
    return '0.00';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!country) newErrors.country = 'Select country';
    if (!giftCard) newErrors.giftCard = 'Select gift card';
    if (!creditUnit) newErrors.creditUnit = 'Select credit unit';
    if (!quantity || isNaN(quantity)) newErrors.quantity = 'Enter valid quantity';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const amount = calculateAmount();

    console.log({
      country,
      giftCard,
      creditUnit,
      quantity,
      amount,
    });

    alert('Gift Card purchase submitted!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerText}>Buy Gift Card</Text>
          </View>
        </View>

        <View style={styles.formWrapper}>
          <View style={styles.formSection}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {/* Country */}
              <View style={{ marginBottom: 25, zIndex: 5 }}>
                <Text style={styles.label}>Country</Text>
                <CustomSelect
                  options={countryOptions}
                  selectedValue={country}
                  onValueChange={setCountry}
                  placeholder="Select country"
                />
                {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
              </View>

              {/* Gift Card */}
              <View style={{ marginBottom: 25, zIndex: 4 }}>
                <Text style={styles.label}>Gift Card</Text>
                <CustomSelect
                  options={giftCardOptions}
                  selectedValue={giftCard}
                  onValueChange={setGiftCard}
                  placeholder="Select gift card"
                />
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
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
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

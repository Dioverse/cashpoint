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
  FlatList,
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
        <Icon
          name="caret-down"
          size={20}
          color="#6B7280"
          style={dropdownStyles.icon}
        />
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

const SellGiftCardScreen = () => {
  const navigation = useNavigation();

  const [giftCard, setGiftCard] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});

  const giftCardOptions = ['Amazon', 'iTunes', 'Google Play', 'Steam', 'eBay'];
  const categoryOptions = ['E-code', 'Physical Card'];

  const validateForm = () => {
    const newErrors = {};
    if (!giftCard) newErrors.giftCard = 'Select gift card';
    if (!category) newErrors.category = 'Select category';
    if (!amount) newErrors.amount = 'Enter amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log({ giftCard, category, amount });
    alert('Gift Card submitted!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header} >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerText}>Sell Gift Card</Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="flex-1 pt-12 px-6 bg-white rounded-t-3xl -mt-6">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {/* Gift Card */}
            <View className='mt-5 mb-5'>
                <Text style={styles.label}>Gift Card</Text>
                <CustomSelect
                options={giftCardOptions}
                selectedValue={giftCard}
                onValueChange={setGiftCard}
                placeholder="Select gift card"
                />
                {errors.giftCard && <Text style={styles.errorText}>{errors.giftCard}</Text>}

            </View>

            {/* Category */}
            <View className='mb-5'>
                <Text style={[styles.label, { marginTop: 24 }]}>Category</Text>
                <CustomSelect
                options={categoryOptions}
                selectedValue={category}
                onValueChange={setCategory}
                placeholder="Select category"
                />
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

            </View>

            {/* Amount */}
            <View className='mt-5 mb-5'>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                style={[
                    styles.input,
                    errors.amount && { borderColor: 'red' },
                ]}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                    setAmount(text);
                    if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                />
                {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* You’re Getting */}
            <View className='bg-[#3432a830] py-3 px-2 mt-5 rounded-lg '>

            <Text style={[styles.label, { marginTop: 14 }]}>You’re Getting</Text>
            <View style={styles.input}>
              <Text style={styles.valueText}>
                ${amount ? (Number(amount) * 0.8).toFixed(2) : '0.00'}
              </Text>
            </View>
            </View>
            
            {/* Submit */}
            <View className='mt-auto'>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            </View>
          </ScrollView>
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
    // marginBottom: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    zIndex: 10,
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
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  valueText: {
    fontSize: 16,
    color: '#4A4A4A',
  },
  submitButton: {
    marginTop: 40,
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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

// Custom Select Styles
const dropdownStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 10,
    position: 'relative',
    zIndex: 99,
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

export default SellGiftCardScreen;

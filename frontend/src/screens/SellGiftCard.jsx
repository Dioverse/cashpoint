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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { CameraIcon } from 'react-native-heroicons/outline';

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

const SellGiftCardScreen = () => {
  const navigation = useNavigation();

  const [giftCard, setGiftCard] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [images, setImages] = useState([]);
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

    console.log({ giftCard, category, amount, images });
    alert('Gift Card submitted!');
  };

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, (response) => {
      if (response.assets) {
        setImages(response.assets);
      }
    });
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
            <Text style={styles.headerText}>Sell Gift Card</Text>
          </View>
        </View>
        <View style={styles.formSectionWrapper}>

        </View>
        <View style={styles.formSection}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Gift Card */}
            <View style={{ marginBottom: 25, zIndex: 3 }}>
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
            <View style={{ marginBottom: 25, zIndex: 2 }}>
              <Text style={styles.label}>Category</Text>
              <CustomSelect
                options={categoryOptions}
                selectedValue={category}
                onValueChange={setCategory}
                placeholder="Select category"
              />
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Amount */}
            <View style={{ marginBottom: 25, zIndex: 1 }}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={[styles.input, errors.amount && { borderColor: 'red' }]}
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
            <View style={{ backgroundColor: '#3432a830', padding: 12, borderRadius: 8,marginBottom: 25 }}>
              <Text style={styles.label}>You’re Getting</Text>
              <View style={styles.input}>
                <Text style={styles.valueText}>
                  ${amount ? (Number(amount) * 0.8).toFixed(2) : '0.00'}
                </Text>
              </View>
            </View>

            {/* Upload Gift Card Image(s) */}
            <View style={{ marginBottom: 25 }}>
              <Text style={styles.label}>Upload Gift Card Image(s)</Text>
              <TouchableOpacity
              className='flex-row justify-between'
                onPress={handleImageUpload}
                style={[styles.input, { justifyContent: 'space-between', alignItems: 'center',backgroundColor: '#3432a830' }]}
              >
                <Text style={{ color: '#6B7280' }}>Click here to upload image(s)</Text>
                <CameraIcon size={20}/>
              </TouchableOpacity>

              <ScrollView horizontal style={{ marginTop: 10 }}>
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img.uri }}
                    style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
                  />
                ))}
              </ScrollView>
            </View>

            

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
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
  },
  submitButton: {
    marginTop: 40,
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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

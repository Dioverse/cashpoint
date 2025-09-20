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
  Image,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { CameraIcon } from 'react-native-heroicons/outline';

import { giftcardAPI } from '../services/apiServices'; // Import your giftcard API service

const loadingImage = require('../assets/images/1.png'); // Adjust path if necessary

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

const SellGiftCardScreen = () => {
  const navigation = useNavigation();
  const [giftCard, setGiftCard] = useState(''); 
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTypes, setIsFetchingTypes] = useState(true);
  const [fetchedGiftCardTypes, setFetchedGiftCardTypes] = useState([]); 
  const [giftCardRatesMap, setGiftCardRatesMap] = useState({}); 

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
  }, [isLoading, zoomAnim]);

  useEffect(() => {
    const fetchTypes = async () => {
      setIsFetchingTypes(true);
      try {
        const result = await giftcardAPI.getTypes();
        if (result.success && result.data && result.data.results && result.data.results.data) {
          const types = result.data.results.data.map(item => item.name);
          setFetchedGiftCardTypes(types);
          
          const newRatesMap = {};
          result.data.results.data.forEach(item => {
            newRatesMap[item.name] = item.rate;
          });
          setGiftCardRatesMap(newRatesMap);
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

  const categoryOptions = ['E-code', 'Physical Card'];

  const calculateYouAreGetting = () => {
    const selectedRate = giftCardRatesMap[giftCard];
    const inputAmount = Number(amount);

    if (selectedRate && !isNaN(inputAmount) && inputAmount > 0) {
      return (inputAmount * Number(selectedRate) * 0.8).toFixed(2);
    }
    return '0.00';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!giftCard) newErrors.giftCard = 'Please select a gift card type.';
    if (!category) newErrors.category = 'Please select a category.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount (must be a number greater than 0).';
    }
    if (images.length === 0) newErrors.images = 'Please upload at least one image.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('Frontend validation failed. Errors:', errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('card_type', giftCard);
      formData.append('category', category);
      formData.append('amount', amount);

      images.forEach((image, index) => {
        if (image.uri && image.type && image.fileName) {
          formData.append('images[]', {
            uri: image.uri,
            type: image.type,
            name: image.fileName,
          });
        } else {
          console.warn(`Skipping invalid image asset at index ${index}:`, image);
        }
      });
console.log(formData)
      // console.log('--- Submitting Sell Gift Card Form ---');
      // console.log('Gift Card (card_type):', giftCard);
      // console.log('Category:', category);
      // console.log('Amount:', amount);
      // console.log('Number of Images:', images.length);
      // console.log('--- End Debugging Logs ---');

      const result = await giftcardAPI.sell(formData);

      if (result.success) {
        Alert.alert('Success', result.data.message || 'Gift Card submitted successfully!');
        setGiftCard('');
        setCategory('');
        setAmount('');
        setImages([]);
        navigation.navigate('Transaction');
      } else {
        Alert.alert('Submission Failed', result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Sell Gift Card error:', error);
      Alert.alert('Error', 'Network error or unexpected issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0, quality: 0.7 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
        Alert.alert('Image Upload Error', 'Failed to pick images. Please try again.');
      } else if (response.assets) {
        const validAssets = response.assets.filter(asset => asset.uri && asset.type && asset.fileName);
        setImages(validAssets);
        if (errors.images) setErrors({ ...errors, images: null });
      }
    });
  };

  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerText}>Sell Gift Card</Text>
          </View>
        </View>
        <View style={styles.formSection}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Gift Card */}
            <View style={{ marginBottom: 25, zIndex: 3 }}>
              <Text style={styles.label}>Gift Card</Text>
              {isFetchingTypes ? (
                <View style={[styles.input, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                  <ActivityIndicator size="small" color="#4B39EF" />
                  <Text style={{ color: '#6B7280', marginLeft: 10 }}>Loading types...</Text>
                </View>
              ) : (
                <CustomSelect
                  options={fetchedGiftCardTypes}
                  selectedValue={giftCard}
                  onValueChange={setGiftCard}
                  placeholder="Select gift card"
                  disabled={isLoading || isFetchingTypes}
                />
              )}
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
                disabled={isLoading}
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
                editable={!isLoading}
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* You’re Getting */}
            <View style={{ backgroundColor: '#3432a830', padding: 12, borderRadius: 8, marginBottom: 25 }}>
              <Text style={styles.label}>You’re Getting</Text>
              <View style={styles.input}>
                <Text style={styles.valueText}>
                  ${calculateYouAreGetting()}
                </Text>
              </View>
            </View>

            {/* Upload Gift Card Image(s) */}
            <View style={{ marginBottom: 25 }}>
              <Text style={styles.label}>Upload Gift Card Image(s)</Text>
              <TouchableOpacity
                onPress={handleImageUpload}
                style={[styles.input, { justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#3432a830' }]}
                disabled={isLoading}
              >
                <Text style={{ color: '#6B7280' }}>Click here to upload image(s)</Text>
                <CameraIcon size={20} />
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
              {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitButton, isLoading && { backgroundColor: '#A0A0A0' }]}
              disabled={isLoading || isFetchingTypes}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Overlay Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Processing Gift Card...</Text>
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

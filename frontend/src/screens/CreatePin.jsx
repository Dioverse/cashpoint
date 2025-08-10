import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { authAPI } from '../services/api';  // Ensure this import matches your project structure

const CreatePinScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handlePinChange = (text) => {
    const newPin = text.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(newPin);
  };

  const handleConfirmPinChange = (text) => {
    const newConfirmPin = text.replace(/[^0-9]/g, '').slice(0, 4);
    setConfirmPin(newConfirmPin);
  };

  const handleCreatePin = async () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit PIN in both fields');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'The PINs do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.createPin(pin, confirmPin); // Call the createPin function from authAPI

      if (response.status) {
        Alert.alert('Success', 'Your PIN has been created successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to create PIN');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create PIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Create New PIN</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter PIN</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your 4 digit PIN"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            value={pin}
            onChangeText={handlePinChange}
            autoFocus
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm PIN</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm your 4 digit PIN"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            value={confirmPin}
            onChangeText={handleConfirmPinChange}
          />
        </View>
      </View>

      <View
        style={[
          styles.buttonWrapper,
          isKeyboardVisible
            ? styles.keyboardVisibleMargin
            : styles.keyboardHiddenMargin,
        ]}>
        <TouchableOpacity
          style={[
            styles.button,
            pin.length === 4 && confirmPin.length === 4 && pin === confirmPin
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
          onPress={handleCreatePin}
          disabled={pin.length !== 4 || confirmPin.length !== 4 || pin !== confirmPin || isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Create PIN'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    marginTop: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonWrapper: {
    paddingHorizontal: 24,
  },
  keyboardVisibleMargin: {
    marginBottom: 24,
  },
  keyboardHiddenMargin: {
    paddingBottom: 32,
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#111827',
  },
  inactiveButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CreatePinScreen;

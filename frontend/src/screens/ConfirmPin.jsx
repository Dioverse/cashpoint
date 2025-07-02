import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const ConfirmPin = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Monitor keyboard visibility
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

  const handlePinChange = text => {
    // Only allow digits and limit to 4 characters
    const newPin = text.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(newPin);
  };

  const handleChangePin = async () => {
    if (pin.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit PIN');
      return;
    }

    setIsLoading(true);

    try {
      // API call would go here
      // await api.changePin(pin);

      Alert.alert('Success', 'Your PIN has been changed successfully', [
        {text: 'OK', onPress: () => navigation.navigate('Dashboard')},
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change PIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Enter New PIN</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter PIN</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your 4 digit transaction PIN"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            value={pin}
            onChangeText={handlePinChange}
            autoFocus
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
            pin.length === 4 ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={handleChangePin}
          disabled={pin.length !== 4 || isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Change PIN'}
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

export default ConfirmPin;

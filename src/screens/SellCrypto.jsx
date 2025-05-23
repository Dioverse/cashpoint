import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SellCryptoScreen = () => {
  const navigation = useNavigation();

  const [amount, setAmount] = useState('');
  const [creditRate, setCreditRate] = useState('');
  const [errors, setErrors] = useState({});

  const calculateYouReceive = () => {
    const amt = parseFloat(amount);
    const rate = parseFloat(creditRate);
    if (!isNaN(amt) && !isNaN(rate)) {
      return (amt * rate).toFixed(2);
    }
    return '0.00';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!amount || isNaN(amount)) newErrors.amount = 'Enter valid amount';
    if (!creditRate || isNaN(creditRate)) newErrors.creditRate = 'Enter valid credit rate';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const youReceive = calculateYouReceive();

    console.log({
      amount,
      creditRate,
      youReceive,
    });

    alert(`You will receive ${youReceive} credits.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerText}>Sell Crypto</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formWrapper}>
          <View style={styles.formSection}>
            {/* Amount */}
            <View style={{ marginBottom: 25 }}>
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

            {/* Credit Rate */}
            <View style={{ marginBottom: 25 }}>
              <Text style={styles.label}>Credit Rate</Text>
              <TextInput
                style={[styles.input, errors.creditRate && { borderColor: 'red' }]}
                placeholder="Current rate"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={creditRate}
                onChangeText={(text) => {
                  setCreditRate(text);
                  if (errors.creditRate) setErrors({ ...errors, creditRate: null });
                }}
              />
              {errors.creditRate && <Text style={styles.errorText}>{errors.creditRate}</Text>}
            </View>

            {/* You Receive */}
            <View style={{ marginBottom: 30,backgroundColor: '#3432a830', padding: 12, borderRadius: 8, }}>
              <Text style={styles.label}>You Receive</Text>
              <View style={styles.input}>
                <Text style={styles.valueText}>${calculateYouReceive()}</Text>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Sell Bitcoin</Text>
            </TouchableOpacity>
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
    borderColor: '#fff',
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
    marginTop: 'auto',
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

export default SellCryptoScreen;

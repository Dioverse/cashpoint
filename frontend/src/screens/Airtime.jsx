import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Contacts from 'react-native-contacts';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI, vtuAPI } from '../services/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const Airtime = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedNetworkKey, setSelectedNetworkKey] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const networks = [
    { id: 1, key: 'mtn', name: 'MTN', icon: require('../assets/images/mtn.png') },
    { id: 2, key: 'glo', name: 'GLO', icon: require('../assets/images/glo.png') },
    { id: 3, key: 'airtel', name: 'AIRTEL', icon: require('../assets/images/airtel.png') },
    { id: 4, key: '9mobile', name: '9MOBILE', icon: require('../assets/images/9mobile.png') },
  ];

  const amounts = [
    { value: 100, display: 'N 100' },
    { value: 200, display: 'N 200' },
    { value: 500, display: 'N 500' },
    { value: 1000, display: 'N 1,000' },
    { value: 2000, display: 'N 2,000' },
    { value: 5000, display: 'N 5,000' },
    { value: 10000, display: 'N 10,000' },
    { value: 11000, display: 'N 11,000' },
  ];

  const recentNumbers = [
    { number: '09098146934', networkKey: 'mtn' },
    { number: '09098146934', networkKey: 'glo' },
    { number: '09098146934', networkKey: 'airtel' },
    { number: '09098146934', networkKey: '9mobile' },
  ];

  const getNetworkIcon = (networkKey) => {
    return networks.find((n) => n.key === networkKey)?.icon;
  };

  const handleSelectContact = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'We need access to your contacts to select a phone number.',
            buttonPositive: 'OK',
          }
        );

        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot access contacts');
          return;
        }
      }

      const contacts = await Contacts.getAll();
      const contactsWithPhone = contacts.filter(
        (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
      );

      if (contactsWithPhone.length === 0) {
        Alert.alert('No Contacts Found', 'No contacts with phone numbers available.');
        return;
      }

      // For demo: pick the first one
      const firstContact = contactsWithPhone[0];
      const number = firstContact.phoneNumbers[0]?.number;

      if (number) {
        const cleaned = number.replace(/\s+/g, '').replace(/[-()]/g, '');
        setPhoneNumber(cleaned);
      }
    } catch (error) {
      console.log('Contact error:', error);
      Alert.alert('Error', 'Something went wrong while accessing contacts');
    }
  };

  const handleBuyAirtime = async () => {
    if (!phoneNumber || !selectedNetworkKey || !selectedAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const networkObj = networks.find((net) => net.key === selectedNetworkKey);
    if (!networkObj) {
      Alert.alert('Error', 'Invalid network selected');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        network_id: networkObj.id,
        phone: phoneNumber,
        amount: selectedAmount,
      };

      const res = await vtuAPI.buyAirtime(payload);

      if (res.success) {
        Alert.alert('Success', 'Airtime purchase successful!');
        setPhoneNumber('');
        setSelectedNetworkKey(null);
        setSelectedAmount(null);
      } else {
        console.log(res);
        Alert.alert('Failed', res.error || 'Purchase failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Airtime Purchase</Text>
      </View>

      <View className="px-7 mb-4 flex flex-row gap-x-2">
        {recentNumbers.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center mr-4"
            onPress={() => {
              setPhoneNumber(item.number);
              setSelectedNetworkKey(item.networkKey);
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white justify-center items-center mb-1">
              <Image source={getNetworkIcon(item.networkKey)} className="w-8 h-8" />
            </View>
            <Text className="text-white text-xs">{item.number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="bg-white rounded-t-3xl px-4 pt-6">
        <View className="bg-[#F3F4F6] p-4 rounded-xl mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-800 font-medium">Phone Number</Text>
            <TouchableOpacity onPress={handleSelectContact}>
              <Text className="text-[#4B39EF] font-medium">Select contact</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            className="h-12 bg-white rounded-lg px-4"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <Text className="text-gray-800 font-medium mb-3">Select Network</Text>
        <View className="flex-row justify-between mb-6">
          {networks.map((network) => (
            <TouchableOpacity
              key={network.key}
              className={`w-[23%] h-16 items-center justify-center rounded-lg ${
                selectedNetworkKey === network.key ? 'bg-[#F3F4F6]' : 'bg-[#3C3ADD21]'
              }`}
              onPress={() => setSelectedNetworkKey(network.key)}
            >
              <View className="w-8 h-8 rounded-full bg-white justify-center items-center mb-1">
                <Image source={network.icon} className="w-6 h-6" />
              </View>
              <Text className="text-xs font-medium">{network.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-800 font-medium mb-3 mt-8">Select an Amount</Text>
        <View className="bg-[#3C3ADD21] p-4 rounded-xl mb-8 flex-row flex-wrap justify-between">
          {amounts.map((amount, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[24%] h-12 items-center justify-center rounded-lg mb-4 ${
                selectedAmount === amount.value ? 'bg-[#4B39EF]' : 'bg-white'
              }`}
              onPress={() => setSelectedAmount(amount.value)}
            >
              <Text
                className={`font-medium ${
                  selectedAmount === amount.value ? 'text-white' : 'text-gray-800'
                }`}
              >
                {amount.display}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mb-6 ${
            phoneNumber && selectedNetworkKey && selectedAmount
              ? 'bg-gray-900'
              : 'bg-gray-400'
          }`}
          onPress={handleBuyAirtime}
          disabled={!phoneNumber || !selectedNetworkKey || !selectedAmount || loading}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? 'Processing...' : 'Proceed'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Airtime;

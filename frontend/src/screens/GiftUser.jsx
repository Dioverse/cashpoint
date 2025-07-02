import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

const GiftUser = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');

  const handleProceed = () => {
    if (username && amount) {
      navigation.navigate('Pin', {
        recipient: username,
        amount,
        transactionType: 'User Gift',
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative mb-4">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Gift User</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-6" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Username */}
        <View className="mt-4 " style={{ backgroundColor: '#3432a830', padding: 12, borderRadius: 8,marginBottom: 25 }}>
          <Text className="text-gray-800 font-medium mb-2">Recipient’s Username</Text>
          <TextInput
            className="h-12 bg-white border border-gray-200 rounded-lg px-4"
            placeholder="Enter correct recipient’s username"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Amount */}
        <View className="mb-6">
          <Text className="text-gray-800 font-medium mb-2 mx-2">Amount</Text>
          <TextInput
            className="h-12 bg-white border border-gray-200 rounded-lg px-4"
            placeholder="Enter amount to gift"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Proceed Button */}
        <View style={{ marginTop: 'auto' }}>
          <TouchableOpacity
            className={`h-14 rounded-xl items-center justify-center mb-6 ${
              username && amount ? 'bg-gray-900' : 'bg-gray-400'
            }`}
            onPress={handleProceed}
            disabled={!username || !amount}>
            <Text className="text-white font-semibold text-base">Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GiftUser;

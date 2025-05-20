import {View, Text, TouchableOpacity, Share, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeftIcon, CheckIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Receipt = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id, date, transactionType} = route.params || {};

  const formattedAmount = (1000)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedDeduction = (980)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Transaction Receipt\n
ID: ${id}\n
Date: ${date}\n
Mobile Number: '0910110101'\n
Transaction Type: {transactionType}\n
Amount: N${formattedAmount}\n
Amount Deduction: N${formattedDeduction}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share receipt');
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Issue',
      'Do you want to report an issue with this transaction?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Report',
          onPress: () => navigation.navigate('ReportIssue', route.params),
        },
      ],
    );
  };

  const goToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Dashboard'}],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={goToDashboard}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">
          Payment Received
        </Text>
      </View>

      {/* Success Icon */}
      <View className="items-center justify-center my-8">
        <View className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center">
            <CheckIcon size={32} color="white" />
          </View>
        </View>
      </View>

      {/* Transaction Receipt Title */}
      <Text className="text-black text-center text-3xl font-bold mb-2">
        Transaction Receipt
      </Text>
      <Text className="text-black text-center mb-6">
        Confirm payment by entering your 4 digit PIN
      </Text>

      {/* Transaction Details Section */}
      <View className="px-5">
        <Text className="text-indigo-600 text-center font-semibold mb-4">
          Transaction Details
        </Text>

        <View className="border border-gray-300 rounded-lg p-5">
          {/* Transaction ID */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-black font-semibold underline">
              Transaction ID
            </Text>
            <Text className="text-black font-semibold underline">{id}</Text>
          </View>

          {/* Date */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-black font-semibold underline">Date</Text>
            <Text className="text-black font-semibold underline">{date}</Text>
          </View>

          {/* Mobile Number */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-black font-semibold underline">
              Mobile Number
            </Text>
            <Text className="text-black font-semibold underline">
              0910110101
            </Text>
          </View>

          {/* Transaction Type */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-black font-semibold underline">
              Transaction Type
            </Text>
            <Text className="text-black font-semibold underline">
              {transactionType}
            </Text>
          </View>

          {/* Amount */}
          <View className="flex-row justify-between mb-4">
            <Text className="text-black font-semibold underline">Amount</Text>
            <Text className="text-black font-semibold underline">
              N {formattedAmount}.00
            </Text>
          </View>

          {/* Amount Deduction */}
          <View className="flex-row justify-between">
            <Text className="text-black font-semibold underline">
              Amount Deduction
            </Text>
            <Text className="text-black font-semibold underline">
              N {formattedDeduction}.00
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between px-5 mt-10">
        <TouchableOpacity
          className="flex-1 py-4 border border-black rounded-full mx-2 items-center"
          onPress={handleReport}>
          <Text className="text-black font-medium">Report Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 py-4 bg-black rounded-full mx-2 items-center"
          onPress={handleShare}>
          <Text className="text-white font-medium">Share Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Receipt;

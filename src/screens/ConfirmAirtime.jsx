import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const ConfirmAirtime = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {phoneNumber, network, amount} = route.params || {};

  // Network data
  const networks = {
    mtn: {name: 'MTN', icon: require('../assets/images/mtn.png')},
    glo: {name: 'GLO', icon: require('../assets/images/glo.png')},
    airtel: {name: 'AIRTEL', icon: require('../assets/images/airtel.png')},
    '9mobile': {name: '9MOBILE', icon: require('../assets/images/9mobile.png')},
  };

  // Calculate discount
  const airtimePercentage = 2; // 2%
  const discountAmount = (amount * airtimePercentage) / 100;
  const amountToCharge = amount - discountAmount;

  const handleConfirmPayment = () => {
    navigation.navigate('Pin');
  };

  const formatAmount = value => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Confirm Payment
        </Text>
      </View>

      {/* Amount Display */}
      <View className="items-center my-8">
        <Text className="text-white text-5xl font-bold">
          ₦ {formatAmount(amount)}.00
        </Text>
      </View>

      {/* Details Container */}
      <View className="flex-1 bg-white rounded-t-3xl px-6 pt-10">
        {/* Payment Details */}
        <View className="mb-8">
          {/* Network */}
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-lg text-gray-800">Network</Text>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#F3F4F6] justify-center items-center mr-2">
                <Image source={networks[network]?.icon} className="w-5 h-5" />
              </View>
              <Text className="text-lg font-medium">
                {networks[network]?.name}
              </Text>
            </View>
          </View>

          {/* Product */}
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-lg text-gray-800">Product</Text>
            <Text className="text-lg font-medium">Airtime Top Up</Text>
          </View>

          {/* Amount */}
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-lg text-gray-800">Amount</Text>
            <Text className="text-lg font-medium">
              N {formatAmount(amount)}.00
            </Text>
          </View>

          {/* Phone Number */}
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-lg text-gray-800">Phone Number</Text>
            <Text className="text-lg font-medium">{phoneNumber}</Text>
          </View>

          {/* Airtime Percentage */}
          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-lg text-gray-800">Airtime Percentage</Text>
            <Text className="text-lg font-medium">%{airtimePercentage}</Text>
          </View>

          {/* Amount to Charge */}
          <View className="flex-row justify-between py-3">
            <Text className="text-lg text-gray-800">Amount to Charge</Text>
            <Text className="text-lg font-bold">
              N{formatAmount(amountToCharge)}.00
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          className="h-14 rounded-xl bg-gray-900 items-center justify-center mb-6"
          onPress={handleConfirmPayment}>
          <Text className="text-white font-semibold text-base">
            Confirm Payment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmAirtime;

import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const FundWallet = () => {
  const navigation = useNavigation();

  const fundingMethods = [
    {
      id: 'bank_transfer',
      title: 'Bank Transfer',
      icon: '💳',
    },
    {
      id: 'crypto',
      title: 'Crypto Wallet Fund',
      icon: '🪙',
    },
  ];

  const handleMethodSelect = methodId => {
    switch (methodId) {
      case 'bank_transfer':
        navigation.navigate('Transfer');
        break;
      case 'crypto':
        navigation.navigate('FundWalletCrypto');
        break;
      default:
        break;
    }
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
        <Text className="text-white text-lg font-semibold">Fund Wallet</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-white rounded-t-3xl px-4 pt-10">
        <ScrollView showsVerticalScrollIndicator={false}>
          {fundingMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              className="bg-[#CCCCCC80] py-5 px-5 rounded-xl mb-5 flex-row justify-between items-center"
              onPress={() => handleMethodSelect(method.id)}>
              <Text className="text-black text-lg font-medium">
                {method.title}
              </Text>
              <View className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center">
                <Image
                  source={require('../assets/images/tesla.png')}
                  className="w-4 h-4"
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FundWallet;

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  GiftIcon,
  CalculatorIcon,
  TrophyIcon,
  UserIcon,
  PhoneIcon,
  GlobeAltIcon,
  LightBulbIcon,
  DeviceTabletIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  CreditCardIcon,
} from 'react-native-heroicons/outline';

const MoreServices = () => {
  const navigation = useNavigation();

  // Service button component
  const ServiceButton = ({title, icon, onPress}) => (
    <TouchableOpacity
      className="flex-1 border border-[#3C3ADD] rounded-lg p-5 m-1 min-w-[45%] justify-center items-center flex-row"
      onPress={onPress}>
      <Text className="text-gray-800 font-medium mr-2">{title}</Text>
      {icon}
    </TouchableOpacity>
  );

  // Define services
  const services = [
    {
      title: 'Trade Crypto',
      icon: <CurrencyDollarIcon size={20} color="black" />,
      onPress: () => navigation.navigate('TradeCrypto'),
    },
    {
      title: 'Sell Giftcard',
      icon: <GiftIcon size={20} color="black" />,
      onPress: () => navigation.navigate('SellGiftCard'),
    },
    {
      title: 'Rate Calculator',
      icon: <CalculatorIcon size={20} color="black" />,
      onPress: () => navigation.navigate('RateCalculator'),
    },
    {
      title: 'Buy Giftcard',
      icon: <GiftIcon size={20} color="black" />,
      onPress: () => navigation.navigate('BuyGiftcard'),
    },
    {
      title: 'Betting',
      icon: <TrophyIcon size={20} color="black" />,
      onPress: () => navigation.navigate('Betting'),
    },
    {
      title: 'Gift User',
      icon: <UserIcon size={20} color="black" />,
      onPress: () => navigation.navigate('GiftUser'),
    },
    {
      title: 'Buy Airtime',
      icon: <PhoneIcon size={20} color="black" />,
      onPress: () => navigation.navigate('BuyAirtime'),
    },
    {
      title: 'Buy Data',
      icon: <GlobeAltIcon size={20} color="black" />,
      onPress: () => navigation.navigate('BuyData'),
    },
    {
      title: 'Electricity Bill',
      icon: <LightBulbIcon size={20} color="black" />,
      onPress: () => navigation.navigate('ElectricityBill'),
    },
    {
      title: 'Cable TV',
      icon: <DeviceTabletIcon size={20} color="black" />,
      onPress: () => navigation.navigate('CableTV'),
    },
    {
      title: 'Education PIN',
      icon: <AcademicCapIcon size={20} color="black" />,
      onPress: () => navigation.navigate('EducationPIN'),
    },
    {
      title: 'Airtime Swap',
      icon: <ArrowPathIcon size={20} color="black" />,
      onPress: () => navigation.navigate('AirtimeSwap'),
    },
    {
      title: 'Save & Earn',
      icon: <CreditCardIcon size={20} color="black" />,
      onPress: () => navigation.navigate('SaveAndEarn'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-16 relative">
        <TouchableOpacity
          className="absolute left-4"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">More Services</Text>
      </View>

      {/* Content */}
      <View className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="flex-row flex-wrap justify-between pb-8">
            {services.map((service, index) => (
              <ServiceButton
                key={index}
                title={service.title}
                icon={service.icon}
                onPress={service.onPress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MoreServices;

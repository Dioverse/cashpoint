import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icon library
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };


const BalanceCard = ({balance= 0,navigation }) => {
  const [showBalance, setShowBalance] = useState(false);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  const renderHiddenBalance = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <FontAwesome
          key={i}
          name="asterisk"
          size={16}
          color="#fff"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
  

  return (
    <View className="bg-[#3C3ADD] px-5 py-8 rounded-3xl w-full">
      {/* First Row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className='flex-column'>
            <Text className="text-white text-2xl font-light">Available Balance</Text>
            <Text className="text-white text-3xl font-bold mt-2" style={{ minHeight: 40 }}>
            {showBalance ? (
              <Text className="text-white text-3xl font-bold">
                {formatCurrency(balance)}
              </Text>
            ) : (
              renderHiddenBalance()
            )}
            </Text>

        </View>
        <TouchableOpacity onPress={toggleBalance} className='bg-[#9db0f585] rounded-full p-[2px]'>
            <Icon
                name={showBalance ? 'eye-off' : 'eye'}
                size={24}
                color="white"
                className="p-1"
            />
        </TouchableOpacity>
      </View>

      {/* Second Row */}
      <View className="flex-row items-center justify-between">
        <View className=" py-1 flex-row items-center justify-between">
            <Text className="text-white text-lg font-lighter mr-5">View Bonus</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MoreServices', { screen: 'SaveAndEarn' })} className="text-[#fff] bg-[#9db0f585] rounded-lg px-3 py-1 flex-row items-center ">
                <Icon
                    name={'lock-closed'}
                    size={12}
                    color="white"
                    className="m-2"
                />{' '}
                <Text className='text-[#fff]'>Save and Earn</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('FundWalletCrypto')} className='bg-[#9db0f585] rounded-full p-2'>
            <Icon name="wallet" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BalanceCard;

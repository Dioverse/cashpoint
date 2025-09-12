import React, { useState, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const formatCurrency = (amount, currency = 'USD') => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
};

const BalanceCard = ({ balance = 0, navigation }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const balances = [
    {
      label: 'Available Balance',
      currency: 'NGN',
      amount: 7250050.08,
    },
    {
      label: 'Available Balance (USD)',
      currency: 'USD',
      amount: 2450.34,
    },
  ];

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

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View className="w-full">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {balances.map((item, index) => (
          <View key={index} style={{ width}} className='px-2'>
            <View className="bg-[#3C3ADD] px-5 py-3 rounded-3xl mx-0 ml-2" style={{ width:'84%', }}>
              {/* First Row */}
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-column">
                  <Text className="text-white text-lg font-light">{item.label}</Text>
                  <Text className="text-white text-2xl font-bold mt-2" style={{ minHeight: 40 }}>
                    {showBalance ? (
                      formatCurrency(item.amount, item.currency)
                    ) : (
                      renderHiddenBalance()
                    )}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={toggleBalance}
                  className="bg-[#9db0f585] rounded-full p-[2px]"
                >
                  <Icon name={showBalance ? 'eye-off' : 'eye'} size={22} color="white" />
                </TouchableOpacity>
              </View>

              {/* Second Row */}
              <View className="flex-row items-center justify-between">
                <View className="py-1 flex-row items-center space-x-4 ">
                  <TouchableOpacity onPress={() => navigation.navigate('Referral')}>
                    <Text className="text-white text-sm font-lighter">View Bonus</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('MoreServices', { screen: 'SaveAndEarn' })}
                    className="text-[#fff] bg-[#9db0f585] rounded-lg ml-2 px-1 py-1 flex-row items-center"
                  >
                    <Icon name={'lock-closed'} size={12} color="white" />
                    <Text className="text-white ml-1 text-sm ">Save and Earn</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Fund')}
                  className="bg-[#9db0f585] rounded-full p-2"
                >
                  <Icon name="wallet" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Indicator Dots */}
      <View className="flex-row justify-center mt-4">
        {balances.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: activeIndex === index ? '#3C3ADD' : '#c3c3c3',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default BalanceCard;

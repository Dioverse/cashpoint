import React, { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import HomeProfileHeader from '../components/HomeProfileHeader';
import BalanceCard from '../components/BalanceCard';
import ActionCard from '../components/ActionCard'; // Import ActionCard
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  // const [user, setUser] = useState(null);
  // const { user } = useAuth();
  // const firstName = (() => {
  //   const n =
  //     user?.first_name ||
  //     user?.firstname ||
  //     (user?.name ? String(user.name).split(' ')[0] : null) ||
  //     (user?.full_name ? String(user.full_name).split(' ')[0] : null) ||
  //     user?.username ||
  //     '';
  //   if (!n) return '';
  //   return n.charAt(0).toUpperCase() + n.slice(1);
  // })();

  const avatarUrl ='https://randomuser.me/api/portraits/women/44.jpg';

  return (
    <ScrollView className="flex-1 bg-white px-4">
      {/* Header */}
      <HomeProfileHeader
        navigation={navigation}
        imageUrl={avatarUrl}
        badgeCount={5}
        // firstName={firstName}
      />

      {/* Balance Card */}
      <BalanceCard balance={7250050.08} navigation={navigation} />

      {/* Action Cards - Two per row */}
      <View className="flex-row flex flex-wrap justify-between gap-4 mt-6">
        {/* Card 1: Trade Giftcard */}
        <ActionCard
          title="Trade Giftcard"
          description="Enjoy sweet rates with swift payment"
          icon={<AntDesign name="gift" size={20} color="#fff" />}
          onPress={() => navigation.navigate('MoreServices', { screen: 'SellGiftCard' })}
        />
        {/* Card 2: Buy Airtime */}
        <ActionCard
          title="Trade Crypto"
          description="Trade BTC, ETH, BNB & More for instant cash"
          icon={<FontAwesome name="btc" size={20} color="#fff" />}
          onPress={() => navigation.navigate('MoreServices', { screen: 'TradeCrypto' })}
        />
      </View>

      {/* 2nd row */}
      <View className="flex-row flex flex-wrap justify-between gap-4 mt-">
        {/* Card 3: Pay Bills */}
        <ActionCard
          title="Use Rate Calculator"
          description="Use rate calculator to preview currency rate"
          icon={<FontAwesome5 name="calculator" size={20} color="#fff" />}
          onPress={() => navigation.navigate('MoreServices', { screen: 'RateCalculator' })}
        />
        {/* Card 4: Fund Wallet */}
        <ActionCard
          title="More Services"
          description="Buy data, purchase airtime and utilities..."
          icon={<FontAwesome5 name="plus-square" size={20} color="#fff" />}
          onPress={() => navigation.navigate('MoreServices')}
        />
      </View>

      {/* New TouchableOpacity Card */}
      <View style={styles.touchableContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')} // Navigate inline
          style={styles.touchableCard}
        >
          {/* Left side (Title and Description) */}
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Cable Purchase Easier</Text>
            <Text style={styles.cardDescription}>
              GOTv, DSTV, and Startime integration with us made more easier
            </Text>
          </View>
          {/* Right side (Image) */}
          <Image
            source={require('../assets/images/4.png')} // Replace with your image path
            style={styles.cardImage}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  touchableContainer: {
    width: '100%',
    marginBottom: 16,
  },
  touchableCard: {
    backgroundColor: '#3432a830',
    width: '100%', // Full width
    borderRadius: 12,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center', // Centering card content
    flexDirection: 'row', // Set flexDirection to row for left and right layout
    justifyContent: 'space-between', // To push title & text to the left, and image to the right
  },
  cardTitle: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 7,
    textAlign: 'left', // Align text to the left
  },
  cardDescription: {
    color: '#000',
    fontSize: 14,
    textAlign: 'left', // Align text to the left
  },
  cardImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const coins = [
  {
    name: 'USDT',
    pair: 'USDT - USD',
    change: '+0.00',
    price: '$1.00',
    image: require('../assets/images/usdt_logo.png'),
  },
  {
    name: 'BTC',
    pair: 'BTC - USD',
    change: '+0.00',
    price: '$26,000.00',
    image: require('../assets/images/btc_logo.png'),
  },
  // {
  //   name: 'PI COIN',
  //   pair: 'PI - USD',
  //   change: '+0.00',
  //   price: '$0.10',
  //   image: require('../assets/images/pi_logo.png'),
  // },
  // {
  //   name: 'BNB',
  //   pair: 'BNB - USD',
  //   change: '+0.00',
  //   price: '$300.00',
  //   image: require('../assets/images/bnb_logo.png'),
  // },
];

const CARD_WIDTH = (Dimensions.get('window').width - 64) / 2;

const TradeCryptoScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SellCrypto')}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardPair}>{item.pair}</Text>
        <Text style={styles.cardPrice}>
          {item.change} <Text style={{ color: '#000' }}>{item.price}</Text>
        </Text>
      </View>
      <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
    </TouchableOpacity>
  );

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
            <Text style={styles.headerText}>Trade Crypto</Text>
          </View>
        </View>

        {/* Content with Curved Top */}
        <View style={styles.curvedContainer}>
          <FlatList
            data={coins}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          />
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
  curvedContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardPair: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 13,
    color: '#10B981',
    marginTop: 4,
  },
  cardImage: {
    width: 30,
    height: 30,
    marginLeft: 'auto',
  },
});

export default TradeCryptoScreen;

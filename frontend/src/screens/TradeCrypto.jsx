import React, {useState, useEffect} from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import cryptoService from '../services/cryptoService';

// Default coins fallback
const defaultCoins = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    usd_rate: 60000,
    logo: null,
    is_active: true,
  },
  {
    id: 2,
    name: 'Tether',
    symbol: 'USDT',
    usd_rate: 1,
    logo: null,
    is_active: true,
  },
];

const CARD_WIDTH = (Dimensions.get('window').width - 64) / 2;

const TradeCryptoScreen = () => {
  const navigation = useNavigation();
  const [coins, setCoins] = useState(defaultCoins);
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState({});

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setIsLoading(true);

      // Fetch crypto types and rates in parallel
      const [typesResponse, ratesResponse] = await Promise.all([
        cryptoService.getCryptoTypes(),
        cryptoService.getCryptoRates(),
      ]);

      if (typesResponse.success) {
        setCoins(typesResponse.results.data);
      }

      if (ratesResponse.status) {
        setRates(ratesResponse.results.data);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      Alert.alert('Error', 'Failed to load cryptocurrency data');
    } finally {
      setIsLoading(false);
    }
  };

  const getCoinImage = symbol => {
    // You can add actual coin images here
    const imageMap = {
      BTC: require('../assets/images/btc_logo.png'),
      USDT: require('../assets/images/usdt_logo.png'),
      BNB: require('../assets/images/bnb_logo.png'),
    };
    return imageMap[symbol] || require('../assets/images/btc_logo.png');
  };

  const getCurrentPrice = symbol => {
    const rate = rates[symbol] || 0;
    return cryptoService.formatUSDAmount(rate);
  };

  const handleCoinPress = coin => {
    // Show action sheet for buy/sell options
    Alert.alert(`${coin.symbol} Trading`, 'What would you like to do?', [
      {
        text: 'Buy',
        onPress: () => navigation.navigate('BuyCrypto', {coin}),
      },
      {
        text: 'Sell',
        onPress: () => navigation.navigate('SellCrypto', {coin}),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCoinPress(item)}
      disabled={!item.is_active}>
      <View style={{flex: 1}}>
        <Text style={styles.cardTitle}>{item.symbol}</Text>
        <Text style={styles.cardPair}>{item.name}</Text>
        <Text style={styles.cardPrice}>
          <Text style={{color: '#000'}}>{getCurrentPrice(item.symbol)}</Text>
        </Text>
      </View>
      <Image
        source={getCoinImage(item.symbol)}
        style={styles.cardImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.headerText}>Trade Crypto</Text>
          </View>
        </View>

        {/* Content with Curved Top */}
        <View style={styles.curvedContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4B39EF" />
              <Text style={styles.loadingText}>
                Loading cryptocurrencies...
              </Text>
            </View>
          ) : (
            <FlatList
              data={coins.filter(coin => coin.is_active)}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
              contentContainerStyle={{padding: 20}}
              showsVerticalScrollIndicator={false}
              refreshing={isLoading}
              onRefresh={fetchCryptoData}
            />
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default TradeCryptoScreen;

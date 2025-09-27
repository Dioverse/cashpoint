import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import {Clipboard} from 'react-native';

const QRDepositScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    coin,
    depositAddress,
    wallet,
    amount,
    rate,
    youReceive,
  } = route.params;



   useEffect(() => {
    const expirationTime = new Date(wallet.expires_at).getTime();
    const now = Date.now();
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) {
      // If already expired, go back immediately
      navigation.goBack();
      return;
    }

    const timer = setTimeout(() => {
      Alert.alert('Expired', 'This deposit address has expired.');
      navigation.goBack();
    }, timeLeft);

    // Cleanup the timer if the component unmounts before expiration
    return () => clearTimeout(timer);
  }, [wallet.expires_at, navigation]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Send {coin.symbol}</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Send to this address:</Text>
        <QRCode value={depositAddress} size={180} />
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(depositAddress);
            Alert.alert('Copied', 'Address copied to clipboard');
          }}
          style={styles.addressBox}>
          <Icon name="copy-outline" size={18} color="#444" />
          <Text selectable style={styles.addressText}>
            {depositAddress}
          </Text>
        </TouchableOpacity>

        <Text style={styles.expiryText}>
          Expiration: {new Date(wallet.expires_at).toLocaleString()}
        </Text>

        <Text style={styles.detailText}>Amount: {amount} {coin.symbol}</Text>
        <Text style={styles.detailText}>You'll Receive: ${youReceive}</Text>
      </View>
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
    marginLeft: 12,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },
  addressText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 13,
    flex: 1,
  },
  expiryText: {
    fontSize: 12,
    marginTop: 12,
    color: '#999',
  },
  detailText: {
    marginTop: 16,
    fontSize: 15,
    color: '#444',
  },
});

export default QRDepositScreen;

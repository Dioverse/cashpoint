import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Tab list
const tabs = ['Airtime', 'Wallet', 'Data', 'Giftcard', 'Crypto'];

// Transactions with 'type' field for filtering
const transactions = [
  {
    id: '1',
    title: 'Data Purchase',
    subtitle: '1GB SME Data - 30 days  | 25th July, 2025',
    amount: '₦680.00',
    image: require('../assets/images/mtn2.png'),
    type: 'Data',
  },
  {
    id: '2',
    title: 'Data Purchase',
    subtitle: '2GB SME Data - 30 days  | 25th July, 2025',
    amount: '₦1,200.00',
    image: require('../assets/images/mtn2.png'),
    type: 'Data',
  },
  {
    id: '3',
    title: 'Airtime Recharge',
    subtitle: 'MTN - 23rd July, 2025',
    amount: '₦500.00',
    image: require('../assets/images/mtn2.png'),
    type: 'Airtime',
  },
  {
    id: '4',
    title: 'Wallet Top-up',
    subtitle: 'Via Card | 20th July, 2025',
    amount: '₦5,000.00',
    image: require('../assets/images/mtn2.png'),
    type: 'Wallet',
  },
  {
    id: '5',
    title: 'Crypto Sale',
    subtitle: 'Sold BTC | 18th July, 2025',
    amount: '₦200,000.00',
    image: require('../assets/images/mtn2.png'),
    type: 'Crypto',
  },
  {
    id: '6',
    title: 'Giftcard Redeemed',
    subtitle: 'Amazon | 15th July, 2025',
    amount: '₦25,000.00',
    image: require('../assets/images/mtn2.png'),
    type: 'Giftcard',
  },
];

const TransactionHistoriesScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Airtime');

  // Filter transactions by active tab
  const filteredTransactions = transactions.filter(
    (item) => item.type === activeTab
  );

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <Image source={item.image} style={styles.transactionImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4B39EF',}}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Blue Section */}
        <View style={styles.headerWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerText}>Transaction Histories</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabPill,
                  activeTab === tab ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* White Curved Content Section */}
        <View style={styles.contentWrapper}>
          {filteredTransactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>No transactions found.</Text>
          ) : (
            <FlatList
              data={filteredTransactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginRight: 24,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 50,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'transparent',
    borderColor: '#9CA3AF',
  },
  inactiveTab: {
    backgroundColor: '#9db0f585',
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    color: '#fff',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  headerWrapper: {
    backgroundColor: '#4B39EF',
    paddingBottom: 40, // <-- increased from 20 to 40
    paddingHorizontal: 20,
  },
  
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -20, // <-- changed from -30 to -20
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30, // <-- increased for breathing room
  },
  
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  transactionImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  transactionSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 'auto',
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    color: '#6B7280',
  },
});

export default TransactionHistoriesScreen;

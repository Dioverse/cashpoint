import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { cryptoAPI, vtuAPI } from '../services/apiServices';
// import { vtuAPI } from '../api/vtuAPI'; // adjust path as needed
// import { cryptoAPI } from '../api/cryptoAPI'; // adjust path as needed

// Tabs
const tabs = ['Airtime', 'Wallet', 'Data', 'Giftcard', 'Crypto'];

const TransactionHistoriesScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Airtime');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDataForTab = async (tab) => {
    setLoading(true);
    let response;

    try {
      switch (tab) {
        case 'Airtime':
          response = await vtuAPI.getAirtimeHistory();
          break;
        case 'Data':
          response = await vtuAPI.getDataHistory();
          break;
        case 'Cable':
          response = await vtuAPI.getCableHistory();
          break;
        case 'Bill':
          response = await vtuAPI.getBillHistory();
          break;
        case 'Crypto':
          response = await cryptoAPI.getHistory();
          break;
        case 'Wallet':
          // TO-DO: Replace with actual wallet history endpoint
          response = { success: true, data: { results: { data: [] } } };
          break;
        case 'Giftcard':
          // TO-DO: Replace with actual giftcard endpoint
          response = { success: true, data: { results: { data: [] } } };
          break;
        default:
          response = { success: true, data: { results: { data: [] } } };
      }

      if (response.success) {
        setTransactions(response.data?.results?.data || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error(`${tab} history fetch error:`, error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataForTab(activeTab);
  }, [activeTab]);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <Image
        source={require('../assets/images/mtn2.png')} // optionally dynamic per tab/type
        style={styles.transactionImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionTitle}>
          {activeTab === 'Crypto'
            ? `${item.type === 'sell' ? 'Sold' : 'Bought'} ${item.amount_crypto} ${getCryptoSymbol(item.crypto_id)}`
            : `${activeTab} Transaction`}
        </Text>
        <Text style={styles.transactionSubtitle}>
          {formatDate(item.created_at)}
        </Text>
      </View>
      <Text style={styles.transactionAmount}>
        ₦{formatAmount(item.naira_equivalent || item.amount)}
      </Text>
    </View>
  );

  const getCryptoSymbol = (id) => {
    // You can fetch and store this from /cryptos endpoint for accurate match
    const symbols = {
      1: 'BTC',
      2: 'USDT',
      5: 'PI',
    };
    return symbols[id] || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4B39EF' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Section */}
        <View style={styles.headerWrapper}>
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

        {/* Content */}
        <View style={styles.contentWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#4B39EF" />
          ) : transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>
              No transactions found.
            </Text>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



// export default TransactionHistoriesScreen;

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

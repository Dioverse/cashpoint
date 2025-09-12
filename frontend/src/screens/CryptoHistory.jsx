import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import cryptoService from '../services/cryptoService';

const CryptoHistoryScreen = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCryptoHistory();
  }, []);

  const fetchCryptoHistory = async () => {
    try {
      setIsLoading(true);
      const response = await cryptoService.getCryptoHistory();

      if (response.success) {
        setHistory(response.results.data);
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to load crypto history',
        );
      }
    } catch (error) {
      console.error('Error fetching crypto history:', error);
      Alert.alert('Error', 'Failed to load crypto history');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCryptoHistory();
    setRefreshing(false);
  };

  const handleTransactionPress = transaction => {
    navigation.navigate('CryptoDetails', {transactionId: transaction.id});
  };

  const getTransactionIcon = type => {
    switch (type?.toLowerCase()) {
      case 'buy':
        return 'arrow-down-circle';
      case 'sell':
        return 'arrow-up-circle';
      case 'withdraw':
        return 'log-out-outline';
      case 'deposit':
        return 'log-in-outline';
      default:
        return 'swap-horizontal-outline';
    }
  };

  const getTransactionColor = type => {
    switch (type?.toLowerCase()) {
      case 'buy':
        return '#4CAF50';
      case 'sell':
        return '#FF9800';
      case 'withdraw':
        return '#F44336';
      case 'deposit':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const renderTransactionItem = ({item}) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => handleTransactionPress(item)}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: getTransactionColor(item.type) + '20'},
          ]}>
          <Icon
            name={getTransactionIcon(item.type)}
            size={24}
            color={getTransactionColor(item.type)}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {cryptoService.getTypeText(item.type)} {item.currency}
          </Text>
          <Text style={styles.transactionDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            {color: getTransactionColor(item.type)},
          ]}>
          {item.type === 'buy' ? '+' : '-'}
          {cryptoService.formatCryptoAmount(item.amount_crypto, item.currency)}
        </Text>
        <Text style={styles.transactionStatus}>
          {cryptoService.getStatusText(item.status)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="swap-horizontal-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>No crypto transactions yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Your cryptocurrency transactions will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.headerText}>Crypto History</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B39EF" />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={
              history.length === 0
                ? styles.emptyContainer
                : styles.listContainer
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
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
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CryptoHistoryScreen;

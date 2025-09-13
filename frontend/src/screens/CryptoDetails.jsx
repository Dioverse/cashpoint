import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import cryptoService from '../services/cryptoService';

const CryptoDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {transactionId} = route.params;

  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId]);

  const fetchTransactionDetails = async () => {
    try {
      setIsLoading(true);
      const response = await cryptoService.getCryptoDetails(transactionId);

      if (response.success) {
        setTransaction(response.result.data);
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to load transaction details',
        );
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setIsLoading(false);
    }
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

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDetailRow = (label, value, isHighlight = false) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, isHighlight && styles.highlightValue]}>
        {value}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.headerText}>Transaction Details</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B39EF" />
          <Text style={styles.loadingText}>Loading transaction details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.headerText}>Transaction Details</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.headerText}>Transaction Details</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transaction Header */}
        <View style={styles.transactionHeader}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: getTransactionColor(transaction.type) + '20'},
            ]}>
            <Icon
              name={getTransactionIcon(transaction.type)}
              size={32}
              color={getTransactionColor(transaction.type)}
            />
          </View>
          <Text style={styles.transactionType}>
            {cryptoService.getTypeText(transaction.type)} {transaction.currency}
          </Text>
          <Text
            style={[
              styles.transactionStatus,
              {color: cryptoService.getStatusColor(transaction.status)},
            ]}>
            {cryptoService.getStatusText(transaction.status)}
          </Text>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>

          {renderDetailRow('Transaction ID', `#${transaction.id}`, true)}
          {renderDetailRow('Type', cryptoService.getTypeText(transaction.type))}
          {renderDetailRow('Currency', transaction.currency)}
          {renderDetailRow(
            'Amount',
            cryptoService.formatCryptoAmount(
              transaction.amount_crypto,
              transaction.currency,
            ),
          )}
          {renderDetailRow(
            'USD Value',
            cryptoService.formatUSDAmount(transaction.amount),
          )}
          {transaction.naira_equivalent &&
            renderDetailRow(
              'NGN Equivalent',
              cryptoService.formatNGNAmount(transaction.naira_equivalent),
            )}
          {renderDetailRow(
            'Status',
            cryptoService.getStatusText(transaction.status),
          )}
          {renderDetailRow('Date', formatDate(transaction.created_at))}

          {transaction.wallet_address && (
            <>
              <Text style={styles.sectionTitle}>Wallet Information</Text>
              {renderDetailRow('Wallet Address', transaction.wallet_address)}
            </>
          )}

          {transaction.transaction_hash && (
            <>
              <Text style={styles.sectionTitle}>Blockchain Information</Text>
              {renderDetailRow(
                'Transaction Hash',
                transaction.transaction_hash,
              )}
            </>
          )}
        </View>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  transactionHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionType: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  transactionStatus: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  highlightValue: {
    fontWeight: '600',
    color: '#4B39EF',
  },
});

export default CryptoDetailsScreen;

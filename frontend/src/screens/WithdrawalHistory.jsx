import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import withdrawalService from '../services/withdrawalService';

const WithdrawalHistory = () => {
  const navigation = useNavigation();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    {id: 'all', label: 'All'},
    {id: 'virtual_account', label: 'Virtual Account'},
    {id: 'crypto', label: 'Crypto'},
  ];

  useEffect(() => {
    fetchWithdrawalHistory();
  }, [selectedFilter]);

  const fetchWithdrawalHistory = async () => {
    try {
      setIsLoading(true);
      const response = await withdrawalService.getWithdrawalHistory(
        selectedFilter,
      );
      if (response.success) {
        setTransactions(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
      Alert.alert('Error', 'Failed to load withdrawal history');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWithdrawalHistory();
    setRefreshing(false);
  };

  const getStatusIcon = status => {
    const statusInfo = withdrawalService.getWithdrawalStatus(status);

    switch (status) {
      case 'completed':
      case 'successful':
        return <CheckCircleIcon size={20} color={statusInfo.color} />;
      case 'failed':
        return <XCircleIcon size={20} color={statusInfo.color} />;
      default:
        return <ClockIcon size={20} color={statusInfo.color} />;
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = (transaction, index) => {
    const statusInfo = withdrawalService.getWithdrawalStatus(
      transaction.status,
    );

    return (
      <View
        key={index}
        className="bg-white p-4 rounded-lg border border-gray-200 mb-3 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            {getStatusIcon(transaction.status)}
            <Text className="text-black font-semibold ml-2">
              {transaction.type === 'withdraw'
                ? 'Crypto Withdrawal'
                : 'Virtual Account'}
            </Text>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{backgroundColor: statusInfo.color + '20'}}>
            <Text
              className="text-xs font-semibold"
              style={{color: statusInfo.color}}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Amount:</Text>
            <Text className="text-black font-semibold">
              {withdrawalService.formatCurrency(
                transaction.amount,
                transaction.currency || 'NGN',
              )}
            </Text>
          </View>

          {transaction.currency && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Currency:</Text>
              <Text className="text-black">{transaction.currency}</Text>
            </View>
          )}

          {transaction.wallet_address && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">To Address:</Text>
              <Text className="text-black text-xs">
                {transaction.wallet_address.slice(0, 8)}...
                {transaction.wallet_address.slice(-8)}
              </Text>
            </View>
          )}

          {transaction.reference && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Reference:</Text>
              <Text className="text-black text-xs">
                {transaction.reference}
              </Text>
            </View>
          )}

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Date:</Text>
            <Text className="text-black text-xs">
              {formatDate(transaction.created_at || transaction.date)}
            </Text>
          </View>

          {transaction.description && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Description:</Text>
              <Text className="text-black text-xs">
                {transaction.description}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-center px-4 py-4 relative">
          <TouchableOpacity
            className="absolute left-4 z-10"
            onPress={() => navigation.goBack()}>
            <ArrowLeftIcon size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-black text-lg font-semibold">
            Withdrawal History
          </Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4B39EF" />
          <Text className="text-gray-600 mt-4">
            Loading transaction history...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-black text-lg font-semibold">
          Withdrawal History
        </Text>
      </View>

      {/* Filters */}
      <View className="px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === filter.id ? 'bg-blue-500' : 'bg-gray-100'
                }`}
                onPress={() => setSelectedFilter(filter.id)}>
                <Text
                  className={`text-sm font-medium ${
                    selectedFilter === filter.id
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Transaction List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) =>
            renderTransaction(transaction, index),
          )
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No withdrawal history</Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Your withdrawal transactions will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WithdrawalHistory;

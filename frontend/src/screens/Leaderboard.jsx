import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon, StarIcon} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import leaderboardService from '../services/leaderboardService';
import {useAuth} from '../context/AuthContext';

const Leaderboard = () => {
  const navigation = useNavigation();
  const {user} = useAuth();

  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);

      const [leaderboardResponse, statsResponse] = await Promise.all([
        leaderboardService.getLeaderboard(),
        leaderboardService.getLeaderboardStats(),
      ]);

      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.data);

        // Find current user in leaderboard
        if (user?.id) {
          const userRank = leaderboardResponse.data.find(
            item => item.user_id === user.id,
          );
          setCurrentUser(userRank);
        }
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      Alert.alert('Error', 'Failed to load leaderboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboardData();
    setRefreshing(false);
  };

  const getTopThree = () => {
    return leaderboard.slice(0, 3);
  };

  const getOtherUsers = () => {
    return leaderboard.slice(3);
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
          <Text className="text-black text-lg font-semibold">Leaderboard</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4B39EF" />
          <Text className="text-gray-600 mt-4">Loading leaderboard...</Text>
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
        <Text className="text-black text-lg font-semibold">Leaderboard</Text>
      </View>

      {/* Stats Section */}
      {stats && (
        <View className="px-4 py-2 bg-gray-50">
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="text-gray-600 text-xs">Total Users</Text>
              <Text className="text-black font-bold text-lg">
                {stats.total_users}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-600 text-xs">Total Points</Text>
              <Text className="text-black font-bold text-lg">
                {leaderboardService.formatPoints(stats.total_points)}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-600 text-xs">Avg Points</Text>
              <Text className="text-black font-bold text-lg">
                {leaderboardService.formatPoints(stats.average_points)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Top 3 Users */}
      {getTopThree().length >= 3 && (
        <View className="flex-row justify-center items-end mt-4 mb-10 relative">
          {/* 2nd Place (Left) */}
          <View className="items-center mr-4">
            <View className="relative">
              <View
                className="w-16 h-16 rounded-full border-2 items-center justify-center overflow-hidden"
                style={{borderColor: getTopThree()[1].color}}>
                {getTopThree()[1].avatar ? (
                  <Image
                    source={{uri: getTopThree()[1].avatar}}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Image
                      source={require('../assets/images/user-silhouette.png')}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View className="absolute -bottom-2 -right-2 bg-[#4B39EF] w-6 h-6 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-xs">2</Text>
              </View>
            </View>
            <Text className="text-black font-medium mt-2 text-center">
              {getTopThree()[1].username}
            </Text>
            <Text className="text-gray-600 text-xs">
              {leaderboardService.formatPoints(getTopThree()[1].points)}
            </Text>
          </View>

          {/* 1st Place (Center) */}
          <View className="items-center z-10 mb-4">
            <View className="relative">
              <View
                className="w-24 h-24 rounded-full border-2 items-center justify-center overflow-hidden"
                style={{borderColor: getTopThree()[0].color}}>
                {getTopThree()[0].avatar ? (
                  <Image
                    source={{uri: getTopThree()[0].avatar}}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Image
                      source={require('../assets/images/user-silhouette.png')}
                      className="w-12 h-12"
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View className="absolute -top-4 -right-2 bg-yellow-400 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-black font-bold">👑</Text>
              </View>
            </View>
            <Text className="text-black font-medium mt-2 text-center">
              {getTopThree()[0].username}
            </Text>
            <Text className="text-gray-600 text-xs">
              {leaderboardService.formatPoints(getTopThree()[0].points)}
            </Text>
          </View>

          {/* 3rd Place (Right) */}
          <View className="items-center ml-4">
            <View className="relative">
              <View
                className="w-16 h-16 rounded-full border-2 items-center justify-center overflow-hidden"
                style={{borderColor: getTopThree()[2].color}}>
                {getTopThree()[2].avatar ? (
                  <Image
                    source={{uri: getTopThree()[2].avatar}}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Image
                      source={require('../assets/images/user-silhouette.png')}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              <View className="absolute -bottom-2 -right-2 bg-[#EF4444] w-6 h-6 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-xs">3</Text>
              </View>
            </View>
            <Text className="text-black font-medium mt-2 text-center">
              {getTopThree()[2].username}
            </Text>
            <Text className="text-gray-600 text-xs">
              {leaderboardService.formatPoints(getTopThree()[2].points)}
            </Text>
          </View>
        </View>
      )}

      {/* Current User Card */}
      {currentUser && (
        <View className="mx-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center overflow-hidden mr-3"
              style={{borderWidth: 2, borderColor: currentUser.color}}>
              {currentUser.avatar ? (
                <Image
                  source={{uri: currentUser.avatar}}
                  className="w-full h-full"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Image
                    source={require('../assets/images/user-silhouette.png')}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-black text-lg font-bold">Your Rank</Text>
              <Text className="text-gray-600">
                #{currentUser.rank} •{' '}
                {leaderboardService.getRankTitle(currentUser.rank)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-black text-lg font-bold">
                {leaderboardService.formatPoints(currentUser.points)}
              </Text>
              <Text className="text-gray-600 text-xs">
                {currentUser.giftcard_transactions +
                  currentUser.crypto_transactions}{' '}
                transactions
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Leaderboard List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getOtherUsers().map((user, index) => (
          <View
            key={user.user_id}
            className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-gray-100">
              <Text className="text-gray-600 font-bold text-sm">
                #{user.rank}
              </Text>
            </View>
            <View
              className="w-10 h-10 rounded-full items-center justify-center overflow-hidden mr-3"
              style={{borderWidth: 1, borderColor: user.color}}>
              {user.avatar ? (
                <Image source={{uri: user.avatar}} className="w-full h-full" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Image
                    source={require('../assets/images/user-silhouette.png')}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-black text-lg font-medium">
                {user.username}
              </Text>
              <Text className="text-gray-600 text-xs">
                {user.giftcard_transactions + user.crypto_transactions}{' '}
                transactions
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-black text-lg font-bold mr-1">
                {leaderboardService.formatPoints(user.points)}
              </Text>
              <StarIcon size={16} color="#FFD700" />
            </View>
          </View>
        ))}

        {leaderboard.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">
              No leaderboard data available
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              Complete some transactions to appear on the leaderboard
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Leaderboard;

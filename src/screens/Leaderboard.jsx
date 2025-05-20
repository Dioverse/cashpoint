import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon, StarIcon} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';

const Leaderboard = () => {
  const navigation = useNavigation();

  // Mock data
  const currentUser = {
    id: '1',
    username: 'John234',
    points: 1664119,
    rank: 1,
    avatar: require('../assets/images/avatar.png'),
  };

  const leaderboard = [
    {
      id: '1',
      username: 'John234',
      points: 1664119,
      rank: 1,
      avatar: require('../assets/images/avatar.png'),
      color: '#FFA500', // Orange for 1st
    },
    {
      id: '2',
      username: 'Joy',
      points: 1263515,
      rank: 2,
      avatar: null,
      color: '#4B39EF', // Blue for 2nd
    },
    {
      id: '3',
      username: 'Qowiyy',
      points: 1068097,
      rank: 3,
      avatar: null,
      color: '#EF4444', // Red for 3rd
    },
  ];

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

      {/* Top 3 Users */}
      <View className="flex-row justify-center items-end mt-4 mb-10 relative">
        {/* 2nd Place (Left) */}
        <View className="items-center mr-4">
          <View className="relative">
            <View
              className="w-16 h-16 rounded-full border-2 items-center justify-center overflow-hidden"
              style={{borderColor: '#4B39EF'}}>
              {leaderboard[1].avatar ? (
                <Image
                  source={leaderboard[1].avatar}
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
          <Text className="text-black font-medium mt-2">
            {leaderboard[1].username}
          </Text>
        </View>

        {/* 1st Place (Center) */}
        <View className="items-center z-10 mb-4">
          <View className="relative">
            <View
              className="w-24 h-24 rounded-full border-2 items-center justify-center overflow-hidden"
              style={{borderColor: '#FFA500'}}>
              {leaderboard[0].avatar ? (
                <Image
                  source={leaderboard[0].avatar}
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
          <Text className="text-black font-medium mt-2">
            {leaderboard[0].username}
          </Text>
        </View>

        {/* 3rd Place (Right) */}
        <View className="items-center ml-4">
          <View className="relative">
            <View
              className="w-16 h-16 rounded-full border-2 items-center justify-center overflow-hidden"
              style={{borderColor: '#EF4444'}}>
              {leaderboard[2].avatar ? (
                <Image
                  source={leaderboard[2].avatar}
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
          <Text className="text-black font-medium mt-2">
            {leaderboard[2].username}
          </Text>
        </View>
      </View>

      {/* Leaderboard List */}
      <ScrollView className="flex-1 px-4">
        {leaderboard.map((user, index) => (
          <View
            key={user.id}
            className="flex-row items-center py-4 border-b border-gray-100">
            <View
              className="w-10 h-10 rounded-full items-center justify-center overflow-hidden mr-3"
              style={{borderWidth: 1, borderColor: user.color}}>
              {user.avatar ? (
                <Image source={user.avatar} className="w-full h-full" />
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
            <Text className="text-black text-lg font-medium flex-1">
              {user.username}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-black text-lg font-bold mr-1">
                {user.points.toLocaleString()} pts
              </Text>
              <StarIcon size={16} color="#FFD700" />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Leaderboard;

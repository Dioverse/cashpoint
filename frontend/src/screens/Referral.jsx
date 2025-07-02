import {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Clipboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Referral = () => {
  const navigation = useNavigation();
  const [showEarnings, setShowEarnings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock referral data
  const referralCode = 'CP-WUMQT';
  const referralLink = `https://cashpoint.app/ref/${referralCode}`;

  // Mock earnings data
  const earnings = {
    total: 5000,
    pending: 1500,
    withdrawn: 3500,
    referrals: [
      {
        id: '1',
        name: 'John Doe',
        date: '2025-03-15',
        status: 'completed',
        amount: 1000,
      },
      {
        id: '2',
        name: 'Jane Smith',
        date: '2025-03-10',
        status: 'completed',
        amount: 1000,
      },
      {
        id: '3',
        name: 'Mark Johnson',
        date: '2025-03-05',
        status: 'completed',
        amount: 1000,
      },
      {
        id: '4',
        name: 'Sarah Williams',
        date: '2025-03-01',
        status: 'completed',
        amount: 1000,
      },
      {
        id: '5',
        name: 'Robert Brown',
        date: '2025-02-25',
        status: 'completed',
        amount: 1000,
      },
    ],
  };

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Use my referral code ${referralCode} to sign up on CashPoint and get a bonus! ${referralLink}`,
        title: 'Join CashPoint',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the referral code');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Referral</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl px-4 pt-10">
        {/* Badge Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center">
            <View className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center">
              <CheckIcon size={28} color="white" />
            </View>
          </View>
        </View>

        {/* Referral Info */}
        <Text className="text-2xl font-bold text-center mb-4">
          Earn Bonuses With Referrals
        </Text>
        <Text className="text-gray-700 text-center px-6 mb-8">
          Invite your friends and family, and earn up to 10% bonus when they
          make their first deposit using your referral code.
        </Text>

        {/* Referral Code */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-12 bg-gray-100 rounded-l-lg flex-row items-center px-4">
            <Text className="text-gray-800 font-medium">{referralCode}</Text>
          </View>
          <TouchableOpacity
            className="bg-[#4B39EF] h-12 px-4 rounded-r-lg items-center justify-center"
            onPress={handleCopyCode}>
            {copied ? (
              <Text className="text-white font-medium">Copied</Text>
            ) : (
              <Text className="text-white font-medium">Copy</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#4B39EF] h-12 ml-2 px-6 rounded-lg items-center justify-center"
            onPress={handleShare}>
            <Text className="text-white font-medium">Share</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Section */}
        <TouchableOpacity
          className="flex-row items-center justify-between py-3 border-b border-gray-200"
          onPress={() => setShowEarnings(!showEarnings)}>
          <Text className="text-lg font-bold">My Referral Earnings</Text>
          {showEarnings ? (
            <ChevronUpIcon size={20} color="#333" />
          ) : (
            <ChevronDownIcon size={20} color="#333" />
          )}
        </TouchableOpacity>

        {/* Earnings Detail (Collapsed by default) */}
        {showEarnings && (
          <View className="py-4">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-gray-600">Total Earned</Text>
                <Text className="text-xl font-bold">
                  ₦{earnings.total.toLocaleString()}
                </Text>
              </View>
              <View>
                <Text className="text-gray-600">Pending</Text>
                <Text className="text-xl font-bold">
                  ₦{earnings.pending.toLocaleString()}
                </Text>
              </View>
              <View>
                <Text className="text-gray-600">Withdrawn</Text>
                <Text className="text-xl font-bold">
                  ₦{earnings.withdrawn.toLocaleString()}
                </Text>
              </View>
            </View>

            <Text className="text-lg font-bold mb-3">Recent Referrals</Text>
            {earnings.referrals.map(referral => (
        <TouchableOpacity
          key={referral.id}
          onPress={() => navigation.navigate('WalletReferral', { referral })}
        >
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <View>
              <Text className="font-medium">{referral.name}</Text>
              <Text className="text-gray-500 text-sm">{referral.date}</Text>
            </View>
            <Text className="text-green-600 font-medium">
              +₦{referral.amount.toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Referral;

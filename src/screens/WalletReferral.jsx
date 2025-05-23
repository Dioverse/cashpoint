import {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
  Share,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  ClipboardDocumentIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const WalletReferral = () => {
  const navigation = useNavigation();
  const [copied, setCopied] = useState(false);

  // Mock data
  const referralCode = 'CP-WUMQT';
  const referralEarnings = 10000;
  const referrals = [
    {
      id: '1',
      name: 'Abdullahi Tijanni Samad',
      date: 'Sun 23, May 2024',
    },
    {
      id: '2',
      name: 'Abdullahi Tijanni Samad',
      date: 'Sun 23, May 2024',
    },
    {
      id: '3',
      name: 'Abdullahi Tijanni Samad',
      date: 'Sun 23, May 2024',
    },
    {
      id: '4',
      name: 'Abdullahi Tijanni Samad',
      date: 'Sun 23, May 2024',
    },
    {
      id: '5',
      name: 'Abdullahi Tijanni Samad',
      date: 'Sun 23, May 2024',
    },
  ];

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Use my referral code ${referralCode} to sign up on CashPoint and get a bonus! https://cashpoint.app/ref/${referralCode}`,
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
        <Text className="text-white text-lg font-semibold">Referral Bonus</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl pt-8">
        {/* Referral Earnings */}
        <View className="px-4 mb-8">
          <Text className="text-2xl font-bold text-center mb-4">
            My Referral Earnings
          </Text>

          <View className="bg-gray-900 py-5 rounded-lg flex-row justify-between items-center px-6">
            <Text className="text-white text-xl font-medium">
              Referral Earnings
            </Text>
            <Text className="text-white text-xl font-bold">
              ₦
              {referralEarnings.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Earn Bonuses */}
        <View className="px-4 mb-8">
          <Text className="text-2xl font-bold text-center mb-4">
            Earn Bonuses With Referrals
          </Text>

          <Text className="text-center text-gray-700 mb-6">
            Invite your friends and family, and earn up to 10% bonus when they
            make their first deposit using your referral code.
          </Text>

          <View className="flex-row items-center justify-center mb-4">
            <View className="bg-gray-100 px-4 py-3 rounded-l-lg">
              <Text className="text-gray-700 font-medium">{referralCode}</Text>
            </View>
            <TouchableOpacity
              onPress={handleCopyCode}
              className="p-3 bg-gray-100 border-l border-gray-300">
              <ClipboardDocumentIcon
                size={18}
                color={copied ? '#4B39EF' : '#6B7280'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#4B39EF] px-4 py-3 rounded-r-lg"
              onPress={handleShare}>
              <Text className="text-white font-medium">Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral List */}
        <View className="px-4 mb-8">
          <Text className="text-2xl font-bold text-center mb-6">
            My Referral Lists
          </Text>

          <View className="bg-[#3C3ADD21] rounded-lg p-4">
            {referrals.map((referral, index) => (
              <View
                key={referral.id}
                className={`flex-row justify-between py-3 ${
                  index < referrals.length - 1 ? 'border-b border-gray-200' : ''
                }`}>
                <View className="flex-row items-center">
                  <ChevronRightIcon size={16} color="#333" />
                  <Text className="text-black ml-1">{referral.name}</Text>
                </View>
                <Text className="text-black">| {referral.date}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletReferral;

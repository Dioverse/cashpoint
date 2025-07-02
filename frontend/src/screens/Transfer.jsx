import {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowLeftIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Transfer = () => {
  const navigation = useNavigation();
  const [copiedAccount, setCopiedAccount] = useState(null);

  // Mock account details
  const accounts = [
    {
      id: 'access_bank',
      accountName: 'Abdullahi Tijanni Samad',
      accountNumber: '0101010101',
      bank: 'Access Bank',
    },
    {
      id: 'moniepoint',
      accountName: 'Abdullahi Tijanni Samad',
      accountNumber: '0101010101',
      bank: 'Moniepoint MFB',
    },
  ];

  const handleCopyAccount = accountId => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      Clipboard.setString(account.accountNumber);
      setCopiedAccount(accountId);

      // Reset copied status after 3 seconds
      setTimeout(() => {
        setCopiedAccount(null);
      }, 3000);
    }
  };

  const handleShareAccount = accountId => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      Share.share({
        message: `Please send funds to my CashPoint account:\nAccount Name: ${account.accountName}\nAccount Number: ${account.accountNumber}\nBank: ${account.bank}`,
        title: 'CashPoint Bank Details',
      }).catch(error => {
        Alert.alert('Error', 'Could not share account details');
      });
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
        <Text className="text-white text-lg font-semibold">
          Fund Wallet (Transfer)
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-white rounded-t-3xl px-4 pt-10 mt-10">
        <Text className="text-3xl font-bold text-center mb-2">
          Account Details
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Make transfer into any of the below account
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} className="px-10">
          {accounts.map(account => (
            <View
              key={account.id}
              className="bg-[#3C3ADD21] py-5 px-5 rounded-xl mb-5">
              <Text className="text-black text-center text-lg font-medium mb-1">
                {account.accountName}
              </Text>
              <Text className="text-black text-center text-3xl font-bold mb-1">
                {account.accountNumber}
              </Text>
              <Text className="text-black text-center text-lg">
                {account.bank}
              </Text>

              {/* Copy or Share buttons  */}
              <View className="flex-row mt-3 mx-auto">
                <TouchableOpacity
                  className="flex-row items-center mr-4"
                  onPress={() => handleCopyAccount(account.id)}>
                  {copiedAccount === account.id ? (
                    <View className="flex-row items-center">
                      <CheckIcon size={16} color="#00C853" />
                      <Text className="text-[#00C853] ml-1">Copied</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center">
                      <ClipboardDocumentIcon size={16} color="#4B39EF" />
                      <Text className="text-[#4B39EF] ml-1">Copy</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => handleShareAccount(account.id)}>
                  <Text className="text-[#4B39EF]">Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View className="h-10" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Transfer;

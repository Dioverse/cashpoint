import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const KycStatusScreen = ({ route }) => {
  const navigation = useNavigation();

  // Current KYC tier (1, 2, or 3)
  const currentTier = route?.params?.currentTier || 1;

  // Determine next screen based on tier
  const getNextTierScreen = () => {
    if (currentTier === 1) return 'UpgradeToTierTwo';
    if (currentTier === 2) return 'UpgradeToTierThree';
    return null;
  };

  // Handle upgrade button press
  const handleUpgrade = () => {
    const nextScreen = getNextTierScreen();
    if (nextScreen) {
      navigation.navigate(nextScreen);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4B39EF' }}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Upgrade (Tier {currentTier})</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.bodyContainer}>
            {/* Headings */}
            <Text style={styles.kycHeading}>Complete Your KYC</Text>
            <Text style={styles.kycDescription}>
              To keep your account safe and secure, we need to verify your identity
            </Text>

            {/* Profile Image */}
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.profileImage}
            />

            {/* Verified Items */}
            {[
              'Selfie Verification',
              'Name',
              'Phone Number',
              'Email Address',
            ].map((label, index) => (
              <View key={index} style={styles.verifiedItem}>
                <Text style={styles.verifiedText}>{label}</Text>
                <Icon name="checkmark" size={24} color="green" />
              </View>
            ))}

            {/* Completed Message */}
            <Text style={styles.completedText}>KYC Tier {currentTier} Completed ✅</Text>

            {/* Account Limits */}
            <View style={styles.limitContainer}>
              <Text style={styles.accountLimitTitle}>Account Limit</Text>
              <View style={styles.limitPill}>
                <Text style={styles.limitText}>Daily transaction limit</Text>
                <Text style={styles.limitText}>
                  {currentTier === 1 ? '₦ 50,000.00' : currentTier === 2 ? '₦ 200,000.00' : '₦ 5,000,000.00'}
                </Text>
              </View>
              <View style={styles.limitPill}>
                <Text style={styles.limitText}>Maximum account balance</Text>
                <Text style={styles.limitText}>
                  {currentTier === 1 ? '₦ 300,000.00' : currentTier === 2 ? '₦ 500,000.00' : 'Unlimited'}
                </Text>
              </View>
            </View>

            {/* Upgrade Button - hide if Tier 3 */}
            {currentTier < 3 && (
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                <Text style={styles.upgradeButtonText}>Upgrade to next level</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KycStatusScreen;

// Styles
const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#4B39EF',
    paddingBottom: 30,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 24,
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '100%',
  },
  kycHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  kycDescription: {
    fontSize: 17,
    color: '#000',
    marginBottom: 20,
    fontWeight: '400',
    // textAlign: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
    // borderRadius: 25,
  },
  verifiedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  verifiedText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  completedText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    marginVertical: 16,
    color: '#4B39EF',
  },
  limitContainer: {
    backgroundColor: '#3432a830',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  accountLimitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  limitPill: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  limitText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

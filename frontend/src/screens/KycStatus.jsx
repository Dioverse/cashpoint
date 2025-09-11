import React, {useEffect, useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../context/AuthContext';
import kycService from '../services/kycService';

const KycStatusScreen = ({route}) => {
  const navigation = useNavigation();
  const {user, setUser} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userKYCData, setUserKYCData] = useState(null);

  // Get current KYC tier from user data or route params
  const currentTier = user?.kyc_tier
    ? user.kyc_tier === 'tier1'
      ? 1
      : user.kyc_tier === 'tier2'
      ? 2
      : 3
    : route?.params?.currentTier || 1;

  // Fetch latest user data on component mount
  useEffect(() => {
    fetchUserKYCStatus();
  }, []);

  const fetchUserKYCStatus = async () => {
    try {
      setIsLoading(true);
      const response = await kycService.getUserKYCStatus();
      if (response.status) {
        setUserKYCData(response.results?.data);
        // Update user context with latest data
        if (user) {
          setUser({
            ...user,
            ...response.results?.data,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get tier limits and next tier info
  const tierLimits = kycService.getTierLimits(currentTier);
  const nextTierInfo = kycService.getNextTierInfo(currentTier);

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

  // Get KYC status display info
  const getKYCStatusInfo = () => {
    const kycStatus = user?.kyc_status || userKYCData?.kyc_status;
    switch (kycStatus) {
      case 'approved':
        return {text: 'Verified ✅', color: '#4CAF50'};
      case 'pending':
        return {text: 'Under Review ⏳', color: '#FF9800'};
      case 'rejected':
        return {text: 'Rejected ❌', color: '#F44336'};
      default:
        return {text: 'Not Started', color: '#9E9E9E'};
    }
  };

  const statusInfo = getKYCStatusInfo();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#4B39EF'}}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
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
        <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.bodyContainer}>
            {/* Headings */}
            <Text style={styles.kycHeading}>KYC Status</Text>
            <Text style={styles.kycDescription}>
              Your identity verification status and account limits
            </Text>

            {/* Loading State */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4B39EF" />
                <Text style={styles.loadingText}>Loading KYC status...</Text>
              </View>
            ) : (
              <>
                {/* Profile Image */}
                <Image
                  source={{
                    uri: 'https://randomuser.me/api/portraits/women/44.jpg',
                  }}
                  style={styles.profileImage}
                />

                {/* KYC Status */}
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Verification Status</Text>
                  <Text style={[styles.statusText, {color: statusInfo.color}]}>
                    {statusInfo.text}
                  </Text>
                </View>

                {/* Verified Items */}
                {[
                  {label: 'Basic Information', completed: true},
                  {
                    label: 'Phone Number',
                    completed: user?.phone || userKYCData?.phone,
                  },
                  {
                    label: 'Email Address',
                    completed: user?.email || userKYCData?.email,
                  },
                  {label: 'ID Verification', completed: currentTier >= 2},
                  {label: 'Address Proof', completed: currentTier >= 3},
                  {label: 'Fund Source', completed: currentTier >= 3},
                ].map((item, index) => (
                  <View key={index} style={styles.verifiedItem}>
                    <Text style={styles.verifiedText}>{item.label}</Text>
                    <Icon
                      name={item.completed ? 'checkmark' : 'close'}
                      size={24}
                      color={item.completed ? 'green' : '#ccc'}
                    />
                  </View>
                ))}

                {/* Current Tier Message */}
                <Text style={styles.completedText}>
                  KYC Tier {currentTier}{' '}
                  {user?.kyc_status === 'approved'
                    ? 'Completed ✅'
                    : 'In Progress'}
                </Text>
              </>
            )}

            {/* Account Limits */}
            {!isLoading && (
              <View style={styles.limitContainer}>
                <Text style={styles.accountLimitTitle}>Account Limits</Text>
                <View style={styles.limitPill}>
                  <Text style={styles.limitText}>Daily transaction limit</Text>
                  <Text style={styles.limitText}>{tierLimits.dailyLimit}</Text>
                </View>
                <View style={styles.limitPill}>
                  <Text style={styles.limitText}>Maximum account balance</Text>
                  <Text style={styles.limitText}>{tierLimits.maxBalance}</Text>
                </View>
                <Text style={styles.limitDescription}>
                  {tierLimits.description}
                </Text>
              </View>
            )}

            {/* Next Tier Info */}
            {!isLoading && nextTierInfo && (
              <View style={styles.nextTierContainer}>
                <Text style={styles.nextTierTitle}>Next Tier Benefits</Text>
                <View style={styles.limitPill}>
                  <Text style={styles.limitText}>Daily transaction limit</Text>
                  <Text style={styles.limitText}>
                    {nextTierInfo.limits.dailyLimit}
                  </Text>
                </View>
                <View style={styles.limitPill}>
                  <Text style={styles.limitText}>Maximum account balance</Text>
                  <Text style={styles.limitText}>
                    {nextTierInfo.limits.maxBalance}
                  </Text>
                </View>
                <Text style={styles.nextTierDescription}>
                  Requirements: {nextTierInfo.requirements.join(', ')}
                </Text>
              </View>
            )}

            {/* Upgrade Button - hide if Tier 3 or KYC is pending/rejected */}
            {!isLoading &&
              currentTier < 3 &&
              user?.kyc_status !== 'pending' &&
              user?.kyc_status !== 'rejected' && (
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={handleUpgrade}>
                  <Text style={styles.upgradeButtonText}>
                    Upgrade to Tier {currentTier + 1}
                  </Text>
                </TouchableOpacity>
              )}

            {/* Refresh Button */}
            {!isLoading && (
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchUserKYCStatus}>
                <Icon name="refresh" size={20} color="#4B39EF" />
                <Text style={styles.refreshButtonText}>Refresh Status</Text>
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
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
  },
  limitDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  nextTierContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  nextTierTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 10,
  },
  nextTierDescription: {
    fontSize: 12,
    color: '#2e7d32',
    marginTop: 10,
    fontStyle: 'italic',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#4B39EF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

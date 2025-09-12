import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import kycService from '../services/kycService';

const KYCStatusCard = ({user, onUpgrade, style}) => {
  if (!user) return null;

  // Get current KYC tier
  const currentTier = user.kyc_tier
    ? user.kyc_tier === 'tier1'
      ? 1
      : user.kyc_tier === 'tier2'
      ? 2
      : 3
    : 1;

  // Get tier limits
  const tierLimits = kycService.getTierLimits(currentTier);
  const nextTierInfo = kycService.getNextTierInfo(currentTier);

  // Get KYC status display info
  const getKYCStatusInfo = () => {
    switch (user.kyc_status) {
      case 'approved':
        return {text: 'Verified', color: '#4CAF50', icon: 'checkmark-circle'};
      case 'pending':
        return {text: 'Under Review', color: '#FF9800', icon: 'time'};
      case 'rejected':
        return {text: 'Rejected', color: '#F44336', icon: 'close-circle'};
      default:
        return {text: 'Not Started', color: '#9E9E9E', icon: 'alert-circle'};
    }
  };

  const statusInfo = getKYCStatusInfo();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.statusSection}>
          <Icon name={statusInfo.icon} size={20} color={statusInfo.color} />
          <Text style={[styles.statusText, {color: statusInfo.color}]}>
            {statusInfo.text}
          </Text>
        </View>
        <Text style={styles.tierText}>Tier {currentTier}</Text>
      </View>

      <View style={styles.limitsSection}>
        <View style={styles.limitRow}>
          <Text style={styles.limitLabel}>Daily Limit</Text>
          <Text style={styles.limitValue}>{tierLimits.dailyLimit}</Text>
        </View>
        <View style={styles.limitRow}>
          <Text style={styles.limitLabel}>Max Balance</Text>
          <Text style={styles.limitValue}>{tierLimits.maxBalance}</Text>
        </View>
      </View>

      {nextTierInfo &&
        user.kyc_status !== 'pending' &&
        user.kyc_status !== 'rejected' && (
          <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
            <Text style={styles.upgradeButtonText}>
              Upgrade to Tier {currentTier + 1}
            </Text>
            <Icon name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B39EF',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  limitsSection: {
    marginBottom: 12,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  limitLabel: {
    fontSize: 12,
    color: '#666',
  },
  limitValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4B39EF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
});

export default KYCStatusCard;

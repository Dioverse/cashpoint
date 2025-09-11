import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import kycService from '../services/kycService';
import {useAuth} from '../context/AuthContext';

const UpgradeToTierThreeScreen = () => {
  const navigation = useNavigation();
  const {user, setUser} = useAuth();
  const [proofOfAddressImage, setProofOfAddressImage] = useState(null);
  const [sourceOfFundImage, setSourceOfFundImage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleProofOfAddressPick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (!response.didCancel && !response.errorCode) {
        setProofOfAddressImage(response.assets[0]);
      }
    });
  };

  const handleSourceOfFundPick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (!response.didCancel && !response.errorCode) {
        setSourceOfFundImage(response.assets[0]);
      }
    });
  };

  const handleSubmitKYC = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      const kycData = {
        address_prove: proofOfAddressImage,
        fund_prove: sourceOfFundImage,
      };

      // Validate data
      const validation = kycService.validateKYCData(kycData, 3);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsLoading(false);
        return;
      }

      // Submit to backend
      const response = await kycService.submitTier3KYC(kycData);

      if (response.status) {
        // Update user data in context
        if (user) {
          setUser({
            ...user,
            kyc_status: 'pending',
            kyc_tier: 'tier3',
            prove_of_address:
              response.results?.data?.prove_of_address || user.prove_of_address,
            prove_of_fund:
              response.results?.data?.prove_of_fund || user.prove_of_fund,
          });
        }

        setShowSuccessModal(true);
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to submit KYC verification',
        );
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to submit KYC verification. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonEnabled = proofOfAddressImage && sourceOfFundImage;

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
            <Text style={styles.headerText}>Upgrade (Tier 3)</Text>
          </View>
        </View>

        {/* Body */}
        <View style={{flex: 1, position: 'relative'}}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <Text style={styles.kycHeading}>Complete Your KYC</Text>
            <Text style={styles.kycDescription}>
              Please upload the required documents to complete your Tier 3
              upgrade
            </Text>

            <View style={styles.verifiedItem}>
              <Text style={styles.verifiedText}>Tier 1</Text>
              <Icon name="checkmark" size={24} color="green" />
            </View>
            <View style={styles.verifiedItem}>
              <Text style={styles.verifiedText}>Tier 2</Text>
              <Icon name="checkmark" size={24} color="green" />
            </View>

            {/* Proof of Address */}
            <Text style={styles.inputLabel}>Proof of Address</Text>
            <TouchableOpacity
              style={[
                styles.inputField,
                errors.address_prove && styles.inputFieldError,
              ]}
              onPress={handleProofOfAddressPick}
              disabled={isLoading}>
              <Text
                style={
                  proofOfAddressImage
                    ? styles.selectedText
                    : styles.placeholderText
                }>
                {proofOfAddressImage
                  ? 'Proof of Address Selected'
                  : 'Please upload a clear image of your utility bill, bank statement or resident permit'}
              </Text>
              <Icon name="image" size={20} color="#999" />
            </TouchableOpacity>
            {errors.address_prove && (
              <Text style={styles.errorText}>{errors.address_prove}</Text>
            )}

            {/* Source of Fund Verification */}
            <Text style={styles.inputLabel}>Source of Fund Verification</Text>
            <TouchableOpacity
              style={[
                styles.inputField,
                errors.fund_prove && styles.inputFieldError,
              ]}
              onPress={handleSourceOfFundPick}
              disabled={isLoading}>
              <Text
                style={
                  sourceOfFundImage
                    ? styles.selectedText
                    : styles.placeholderText
                }>
                {sourceOfFundImage
                  ? 'Source of Fund Document Selected'
                  : 'Upload a clear image of your business registration slip or payslip'}
              </Text>
              <Icon name="image" size={20} color="#999" />
            </TouchableOpacity>
            {errors.fund_prove && (
              <Text style={styles.errorText}>{errors.fund_prove}</Text>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4B39EF" />
                <Text style={styles.loadingText}>
                  Submitting KYC verification...
                </Text>
              </View>
            )}

            {/* Upgrade Button */}
            <TouchableOpacity
              style={[
                styles.upgradeButton,
                (!isButtonEnabled || isLoading) && styles.upgradeButtonDisabled,
              ]}
              disabled={!isButtonEnabled || isLoading}
              onPress={handleSubmitKYC}>
              <Text style={styles.upgradeButtonText}>
                {isLoading ? 'Submitting...' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Success Modal */}
          <Modal
            visible={showSuccessModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowSuccessModal(false)}>
            <View style={styles.successModalOverlay}>
              <View style={styles.successModalContainer}>
                <Icon name="checkmark-circle" size={160} color="black" />
                <Text style={styles.successMessage}>Upgrade Successful</Text>
                <TouchableOpacity
                  style={styles.goHomeButton}
                  onPress={() =>
                    navigation.navigate('Dashboard', {screen: 'Home'})
                  }>
                  <Text style={styles.goHomeButtonText}>Go Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpgradeToTierThreeScreen;

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
  pillsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  pill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#999',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillDone: {
    backgroundColor: '#4B39EF',
    borderColor: '#4B39EF',
  },
  pillText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  selectedText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  upgradeButtonDisabled: {
    backgroundColor: '#999',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  successMessage: {
    fontSize: 30,
    fontWeight: '700',
    color: 'black',
    marginVertical: 20,
    textAlign: 'center',
  },
  goHomeButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  goHomeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  verifiedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  inputFieldError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

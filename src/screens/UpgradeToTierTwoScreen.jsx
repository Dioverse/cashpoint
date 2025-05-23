import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const ID_OPTIONS = [
  { label: 'NIN Card / Slip', value: 'nin', icon: 'card' },
  { label: 'Driver’s License', value: 'license', icon: 'car' },
  { label: 'BVN Number', value: 'bvn', icon: 'key' },
  { label: 'Passport', value: 'passport', icon: 'globe' },
];

const UpgradeToTierTwoScreen = () => {
  const navigation = useNavigation();
  const [selectedID, setSelectedID] = useState(null);
  const [idImage, setIdImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showIdVerifiedModal, setShowIdVerifiedModal] = useState(false);

  useEffect(() => {
    if (idImage && selfieImage) {
      setTimeout(() => setShowIdVerifiedModal(true), 500);
    }
  }, [idImage, selfieImage]);

  const handleIdImagePick = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      (response) => {
        if (!response.didCancel && !response.errorCode) {
          setIdImage(response.assets[0].uri);
          setShowModal(false);
        }
      }
    );
  };

  const handleSelfiePick = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      (response) => {
        if (!response.didCancel && !response.errorCode) {
          setSelfieImage(response.assets[0].uri);
        }
      }
    );
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
            <Text style={styles.headerText}>Upgrade (Tier 2)</Text>
          </View>
        </View>

        {/* Body */}
        <View style={{ flex: 1, position: 'relative' }}>
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <Text style={styles.kycHeading}>Complete Your KYC</Text>
            <Text style={styles.kycDescription}>
              To keep your account safe and secure, we need to verify your identity
            </Text>

            <View style={styles.verifiedItem}>
              <Text style={styles.verifiedText}>Tier 1</Text>
              <Icon name="checkmark" size={24} color="green" />
            </View>

            {/* Upload Valid ID */}
            <Text style={styles.inputLabel}>Upload Valid ID</Text>
            <TouchableOpacity
              style={styles.inputField}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.placeholderText}>
                {selectedID ? selectedID.label : 'Please select your ID type'}
              </Text>
              <Icon name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Selfie Verification */}
            <Text style={styles.inputLabel}>Selfie Verification</Text>
            <TouchableOpacity style={styles.inputField} onPress={handleSelfiePick}>
              <Text style={styles.placeholderText}>
                {selfieImage ? 'Selfie Selected' : 'Tap to select your selfie'}
              </Text>
              <Icon name="camera" size={20} color="#999" />
            </TouchableOpacity>

            {/* Account Limits */}
            <View style={styles.limitContainer}>
              <Text style={styles.accountLimitTitle}>Account Limit</Text>
              <View style={styles.limitPill}>
                <Text style={styles.limitText}>Daily transaction limit</Text>
                <Text style={styles.limitText}>₦ 100,000.00</Text>
              </View>
              <View style={styles.limitPill}>
                <Text style={styles.limitText}>Maximum account balance</Text>
                <Text style={styles.limitText}>₦ 500,000.00</Text>
              </View>
            </View>
          </ScrollView>

          {/* Verified Modal over white section */}
          {showIdVerifiedModal && (
            <View style={styles.verifiedBodyModal}>
                <View className="flex flex-col items-center justify-center">
                    <Icon name="checkmark-circle" size={160} color="black" />
                    <Text style={styles.verifiedMessage}>ID VERIFIED</Text>
                </View>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => navigation.navigate('Dashboard',{ screen: 'Home' })}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Tier 2</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ID Type Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setShowModal(false)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select ID Type</Text>
              {ID_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.modalOption}
                  onPress={() => setSelectedID(option)}
                >
                  <Icon
                    name={option.icon}
                    size={20}
                    color="#333"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionText}>{option.label}</Text>
                  <View style={styles.radioIndicator}>
                    {selectedID?.value === option.value && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.captureButton} onPress={handleIdImagePick}>
                <Text style={styles.captureButtonText}>Capture Photo</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpgradeToTierTwoScreen;

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
    textAlign: 'center',
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
    width: '100%',
    marginTpo: 'auto'
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
  },
  radioIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  captureButton: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  captureButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  verifiedBodyModal: {
    position: 'absolute',
    top: 0, // Below header
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  verifiedMessage: {
    fontSize: 30,
    fontWeight: '700',
    color: 'black',
    marginVertical: 15,
  },
});

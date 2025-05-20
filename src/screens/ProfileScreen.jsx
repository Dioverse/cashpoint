import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Ionicons';
import ProfileHeader from '../components/ProfileHeader';

function ProfileScreen() {
  const navigation = useNavigation();

  const ProfileItem = ({icon, title, description, onPress, isPersonIcon}) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View
          style={[
            styles.iconContainer,
            isPersonIcon
              ? styles.personIconContainer
              : styles.regularIconContainer,
          ]}>
          {isPersonIcon ? (
            <Icon name={icon} size={16} color="#FFF" />
          ) : (
            <Icon name={icon} size={16} color="#C7C7C7" />
          )}
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemDescription}>{description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const SectionTitle = ({title}) => {
    return <Text style={styles.sectionTitle}>{title}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />

      {/* Profile Header */}
      <ProfileHeader />

      {/* Main Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SectionTitle title="Account" />
        <View style={styles.sectionContainer}>
          <ProfileItem
            icon="person-outline"
            title="Personal Information"
            description="See your account information and login details"
            isPersonIcon={true}
            onPress={() => navigation.navigate('PersonalInformation')}
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="card-outline"
            title="Bank Card/Account"
            description="2 visa / 1 Naira linked Card/Account"
            isPersonIcon={false}
            onPress={() => navigation.navigate('BankAccounts')}
          />
        </View>

        {/* Security Section */}
        <SectionTitle title="Security" />
        <View style={styles.sectionContainer}>
          <ProfileItem
            icon="lock-closed-outline"
            title="Change Password"
            description="Make changes to your account password"
            isPersonIcon={true}
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="shield-checkmark-outline"
            title="KYC"
            description="Please verify your identity to have access to more features"
            isPersonIcon={false}
            onPress={() => navigation.navigate('KYC')}
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="key-outline"
            title="PIN Management"
            description="Make changes to your transaction PIN"
            isPersonIcon={false}
            onPress={() => navigation.navigate('ChangePin')}
          />
        </View>

        {/* Services Section */}
        <SectionTitle title="Services" />
        <View style={styles.sectionContainer}>
          <ProfileItem
            icon="information-circle-outline"
            title="About Us"
            description="Learn more about CashPoint"
            isPersonIcon={true}
            onPress={() => navigation.navigate('AboutUs')}
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="help-buoy-outline"
            title="Help and Support"
            description="Contact our support, we are available to assist you 24/7"
            isPersonIcon={false}
            onPress={() => navigation.navigate('Support')}
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="document-text-outline"
            title="Terms and Conditions"
            description="See our terms of use and conditions"
            isPersonIcon={false}
            onPress={() => navigation.navigate('Terms')}
          />
        </View>

        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C3ADD',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  personIconContainer: {
    backgroundColor: '#4B39EF',
  },
  regularIconContainer: {
    backgroundColor: '#F0F0F0',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 62,
  },
});

export default ProfileScreen;

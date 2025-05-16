// screens/Support.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Linking,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProfileHeader from '../components/ProfileHeader';

const FACEBOOK_ICON = require('../assets/icons/facebook.png');
const TWITTER_ICON = require('../assets/icons/twitter.png');
const WHATSAPP_ICON = require('../assets/icons/whatsapp.png');
const INSTAGRAM_ICON = require('../assets/icons/instagram.png');

const Support = () => {
  const socialLinks = [
    {
      name: 'Facebook (Cashpoint)',
      url: 'https://facebook.com/Cashpoint',
      icon: FACEBOOK_ICON,
    },
    {
      name: 'Twitter',
      url: 'https://x.com/Cashpoint_official',
      icon: TWITTER_ICON,
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/+2349000000000',
      icon: WHATSAPP_ICON,
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/cashpoint_support',
      icon: INSTAGRAM_ICON,
    },
  ];

  const handleOpenLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Error opening URL: ', err),
    );
  };

  const IconPlaceholder = ({type}) => {
    let content;

    switch (type) {
      case 'facebook':
        content = 'f';
        break;
      case 'twitter':
        content = 'X';
        break;
      case 'whatsapp':
        content = 'W';
        break;
      case 'instagram':
        content = 'IG';
        break;
      default:
        content = '';
    }

    return (
      <View
        style={[
          styles.iconPlaceholder,
          type === 'facebook'
            ? styles.facebookColor
            : type === 'twitter'
            ? styles.twitterColor
            : type === 'whatsapp'
            ? styles.whatsappColor
            : styles.instagramColor,
        ]}>
        <Text style={styles.iconPlaceholderText}>{content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />

      {/* Reusable Profile Header */}
      <ProfileHeader />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Help and Support</Text>

        <View style={styles.socialLinksContainer}>
          {socialLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.socialLinkItem}
              onPress={() => handleOpenLink(link.url)}>
              <View style={styles.socialLinkContent}>
                {/* Replace this with Image when you have actual icons */}
                {/* <Image source={link.icon} style={styles.socialIcon} /> */}
                <IconPlaceholder
                  type={
                    link.name.toLowerCase().includes('facebook')
                      ? 'facebook'
                      : link.name.toLowerCase().includes('twitter')
                      ? 'twitter'
                      : link.name.toLowerCase().includes('whatsapp')
                      ? 'whatsapp'
                      : 'instagram'
                  }
                />
                <View style={styles.socialTextContainer}>
                  <Text style={styles.socialTitle}>{link.name}</Text>
                  <Text style={styles.socialUrl}>{link.url}</Text>
                </View>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C3ADD',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  socialLinksContainer: {
    marginBottom: 20,
  },
  socialLinkItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  socialTextContainer: {
    flex: 1,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  socialUrl: {
    fontSize: 12,
    color: '#666',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  // Placeholder styles
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconPlaceholderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  facebookColor: {
    backgroundColor: '#3b5998',
  },
  twitterColor: {
    backgroundColor: '#1DA1F2',
  },
  whatsappColor: {
    backgroundColor: '#25D366',
  },
  instagramColor: {
    backgroundColor: '#C13584',
  },
});

export default Support;

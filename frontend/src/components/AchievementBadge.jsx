import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AchievementBadge = ({badge, size = 'medium'}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          icon: styles.smallIcon,
          text: styles.smallText,
        };
      case 'large':
        return {
          container: styles.largeContainer,
          icon: styles.largeIcon,
          text: styles.largeText,
        };
      default:
        return {
          container: styles.mediumContainer,
          icon: styles.mediumIcon,
          text: styles.mediumText,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        sizeStyles.container,
        {backgroundColor: badge.color + '20'},
      ]}>
      <Text style={[sizeStyles.icon, {color: badge.color}]}>{badge.icon}</Text>
      <Text style={[sizeStyles.text, {color: badge.color}]}>{badge.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  smallContainer: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  mediumContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  largeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  smallIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  mediumIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  largeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  smallText: {
    fontSize: 10,
    fontWeight: '600',
  },
  mediumText: {
    fontSize: 12,
    fontWeight: '600',
  },
  largeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AchievementBadge;

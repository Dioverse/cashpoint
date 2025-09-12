import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {StarIcon} from 'react-native-heroicons/solid';
import leaderboardService from '../services/leaderboardService';
import AchievementBadge from './AchievementBadge';

const LeaderboardCard = ({user, showBadges = false, onPress = null}) => {
  const badges = showBadges
    ? leaderboardService.getAchievementBadges(user.points)
    : [];

  const CardContent = () => (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={[styles.rankBadge, {backgroundColor: user.color + '20'}]}>
          <Text style={[styles.rankText, {color: user.color}]}>
            #{user.rank}
          </Text>
        </View>
        <View style={[styles.avatarContainer, {borderColor: user.color}]}>
          {user.avatar ? (
            <Image source={{uri: user.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.rankTitle}>
          {leaderboardService.getRankTitle(user.rank)}
        </Text>
        <Text style={styles.transactionCount}>
          {user.giftcard_transactions + user.crypto_transactions} transactions
        </Text>

        {showBadges && badges.length > 0 && (
          <View style={styles.badgesContainer}>
            {badges.slice(0, 2).map((badge, index) => (
              <AchievementBadge key={index} badge={badge} size="small" />
            ))}
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>
            {leaderboardService.formatPoints(user.points)}
          </Text>
          <StarIcon size={16} color="#FFD700" />
        </View>

        {user.rank <= 3 && (
          <View style={styles.rankIcon}>
            <Text style={styles.rankEmoji}>
              {leaderboardService.getRankBadge(user.rank)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={() => onPress(user)}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  middleSection: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  rankTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  transactionCount: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  rankIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 12,
  },
});

export default LeaderboardCard;

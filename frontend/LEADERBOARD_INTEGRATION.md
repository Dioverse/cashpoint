# Leaderboard Integration Documentation

## Overview

This document outlines the complete leaderboard integration for the CashPoint mobile application, which calculates user rankings based on successful Giftcard and Crypto transactions.

## Features

### 🏆 **Dynamic Leaderboard System**

- **Real-time Rankings**: Based on actual transaction success
- **Multi-Service Integration**: Combines Giftcard and Crypto transaction data
- **Point-Based Scoring**: Sophisticated point calculation system
- **User Rankings**: Dynamic ranking with titles and badges

### 📊 **Point Calculation System**

#### **Giftcard Transactions**

- **Base Points**: Based on transaction amount in NGN

  - ₦100,000+ = 1,000 points (High value)
  - ₦50,000+ = 500 points (Medium value)
  - ₦10,000+ = 250 points (Standard)
  - <₦10,000 = 100 points (Small)

- **Card Type Bonuses**:

  - Steam = 60 points
  - Amazon = 50 points
  - iTunes = 40 points
  - Apple = 45 points
  - Google Play = 30 points
  - Others = 20 points

- **Quantity Multiplier**: Up to 5x for multiple cards

#### **Crypto Transactions**

- **Base Points**: Based on transaction amount in USD

  - $1,000+ = 1,500 points (High value)
  - $500+ = 750 points (Medium value)
  - $100+ = 400 points (Standard)
  - <$100 = 200 points (Small)

- **Crypto Type Bonuses**:

  - BTC = 100 points
  - ETH = 80 points
  - BNB = 60 points
  - USDT = 50 points
  - Others = 30 points

- **Transaction Type Multiplier**:
  - Buy transactions = 1.2x multiplier
  - Sell transactions = 1.0x multiplier

### 🎯 **Ranking System**

#### **Rank Titles**

- **#1**: Champion 👑
- **#2**: Elite 🥈
- **#3**: Expert 🥉
- **#4-5**: Advanced
- **#6-10**: Pro
- **#11+**: Member

#### **Achievement Badges**

- **100,000+ points**: Crypto Master 🚀
- **50,000+ points**: Giftcard Pro 🎁
- **25,000+ points**: Trading Expert 💎
- **10,000+ points**: Active Trader ⭐
- **5,000+ points**: Rising Star 🌟

## Technical Implementation

### **Service Layer**

- **`leaderboardService.js`**: Main service for leaderboard operations
- **API Integration**: Fetches data from Giftcard and Crypto history endpoints
- **Point Calculation**: Sophisticated algorithm for fair scoring
- **Data Aggregation**: Combines multiple data sources

### **Frontend Components**

- **`Leaderboard.jsx`**: Main leaderboard screen with real-time data
- **Loading States**: Proper loading indicators and error handling
- **Pull-to-Refresh**: Real-time data updates
- **Responsive Design**: Optimized for mobile devices

## API Integration

### **Data Sources**

1. **Giftcard History**: `/api/giftcard/history` (Current user only)
2. **Crypto History**: `/api/crypto/history` (Current user only)
3. **Mock Leaderboard Data**: Generated for demonstration purposes

**Note**: The current implementation uses mock data for the leaderboard since the existing endpoints only return the current user's transaction history. For a production leaderboard, you would need a dedicated endpoint that returns aggregated data from all users.

### **Data Processing**

1. **Fetch Transaction Data**: Get all user transactions
2. **Filter Successful Transactions**: Only count approved/completed transactions
3. **Calculate Points**: Apply point calculation algorithm
4. **Aggregate by User**: Sum points per user
5. **Generate Rankings**: Sort and rank users
6. **Format Display Data**: Prepare data for UI

## User Experience

### **Leaderboard Display**

- **Top 3 Podium**: Special display for top performers
- **Current User Card**: Highlights user's position
- **Full Rankings**: Complete list with transaction counts
- **Statistics**: Total users, points, and averages

### **Visual Elements**

- **Rank Colors**: Gold, Blue, Red for top 3
- **Crown Icon**: Special indicator for #1
- **Point Formatting**: K/M notation for large numbers
- **Transaction Counts**: Shows activity level

## Data Models

### **User Points Object**

```javascript
{
  user_id: number,
  username: string,
  avatar: string,
  total_points: number,
  giftcard_points: number,
  crypto_points: number,
  giftcard_transactions: number,
  crypto_transactions: number,
  rank: number,
  color: string
}
```

### **Leaderboard Stats**

```javascript
{
  total_users: number,
  total_points: number,
  average_points: number,
  top_user: object
}
```

## Service Methods

### **Core Methods**

- `getLeaderboard()`: Fetch complete leaderboard data
- `getUserRank(userId)`: Get specific user's rank
- `getLeaderboardStats()`: Get leaderboard statistics
- `calculateUserPoints()`: Calculate points for all users
- `generateLeaderboard()`: Create ranked leaderboard

### **Utility Methods**

- `formatPoints(points)`: Format points for display
- `getRankColor(rank)`: Get color for rank position
- `getRankTitle(rank)`: Get title for rank
- `getAchievementBadges(points)`: Get user badges
- `getPointsBreakdown(user)`: Get detailed point breakdown

## Error Handling

### **Network Errors**

- Graceful fallback to cached data
- User-friendly error messages
- Retry mechanisms

### **Data Validation**

- Validate transaction data
- Handle missing user information
- Default values for incomplete data

### **Edge Cases**

- Empty leaderboard
- Single user scenarios
- Tied rankings

## Performance Optimizations

### **Data Fetching**

- Parallel API calls for giftcard and crypto data
- Efficient data aggregation
- Minimal re-renders

### **UI Performance**

- Virtualized lists for large datasets
- Optimized image loading
- Smooth animations

### **Caching**

- Cache leaderboard data
- Background refresh
- Smart update strategies

## Security Considerations

### **Data Privacy**

- Only show usernames and public data
- No sensitive transaction details
- User consent for leaderboard participation

### **Data Integrity**

- Validate transaction status
- Prevent point manipulation
- Audit trail for changes

## Future Enhancements

### **Advanced Features**

- **Time-based Rankings**: Daily, weekly, monthly leaderboards
- **Category Rankings**: Separate rankings for giftcard vs crypto
- **Achievement System**: Unlockable badges and rewards
- **Social Features**: Follow top performers
- **Notifications**: Rank change alerts

### **Analytics**

- **User Engagement**: Track leaderboard usage
- **Transaction Patterns**: Analyze user behavior
- **Performance Metrics**: Monitor system performance

### **Gamification**

- **Streaks**: Consecutive successful transactions
- **Challenges**: Special point multipliers
- **Rewards**: Exclusive benefits for top users
- **Tournaments**: Time-limited competitions

## Testing

### **Unit Tests**

- Point calculation algorithms
- Data aggregation logic
- Utility functions
- Error handling

### **Integration Tests**

- API endpoint integration
- Data flow validation
- UI component behavior
- Performance benchmarks

### **User Acceptance Tests**

- Complete user journeys
- Edge case scenarios
- Performance under load
- Cross-device compatibility

## Deployment Notes

### **Environment Configuration**

- API endpoint configuration
- Point calculation parameters
- Cache settings
- Performance thresholds

### **Monitoring**

- Leaderboard performance metrics
- User engagement analytics
- Error tracking
- System health monitoring

## Troubleshooting

### **Common Issues**

1. **"No leaderboard data available"**

   - Check API endpoint connectivity
   - Verify transaction data exists
   - Check user authentication

2. **"Failed to load leaderboard data"**

   - Check network connection
   - Verify API responses
   - Check error logs

3. **"User not appearing on leaderboard"**

   - Verify user has successful transactions
   - Check transaction status
   - Confirm data aggregation

4. **"Incorrect point calculations"**
   - Verify transaction amounts
   - Check point calculation logic
   - Validate bonus multipliers

### **Debug Mode**

Enable debug logging by setting `DEBUG=true` in environment variables.

## Support

For technical support or questions about the leaderboard integration:

- Check the troubleshooting section above
- Review API documentation
- Contact the development team
- Check system status page

## Changelog

### Version 1.0.0

- Initial leaderboard integration
- Giftcard and crypto transaction scoring
- Dynamic ranking system
- Achievement badges
- Real-time data updates

### Future Versions

- Time-based rankings
- Advanced gamification
- Social features
- Enhanced analytics
- Performance optimizations

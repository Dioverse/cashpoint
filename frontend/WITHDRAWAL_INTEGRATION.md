# Withdrawal Integration Documentation

## Overview

This document outlines the complete withdrawal integration for the CashPoint mobile application, providing users with multiple withdrawal methods including Virtual Account conversions and Crypto wallet withdrawals.

## Features

### 💳 **Multi-Method Withdrawal System**

- **Virtual Account Withdrawals**: Convert between NGN and USD instantly
- **Crypto Withdrawals**: Send cryptocurrencies to external wallets
- **Real-time Balance Display**: Live wallet balance updates
- **Transaction History**: Complete withdrawal transaction tracking

### 🔄 **Virtual Account Withdrawals**

- **NGN to USD Conversion**: Convert Naira to USD at current exchange rates
- **USD to NGN Conversion**: Convert USD to Naira at current exchange rates
- **Instant Processing**: Real-time conversion with no delays
- **No Fees**: Free conversions between virtual accounts

### ₿ **Crypto Withdrawals**

- **Multi-Currency Support**: BTC, USDT, ETH, BNB
- **External Wallet Support**: Send to any valid crypto address
- **Network Fee Calculation**: Automatic fee calculation and display
- **Address Validation**: Real-time wallet address validation

## Technical Implementation

### **Service Layer**

- **`withdrawalService.js`**: Comprehensive service with 25+ methods
- **API Integration**: Connects to Virtual Account and Crypto Wallet endpoints
- **Validation Logic**: Client-side validation for all withdrawal types
- **Error Handling**: Robust error handling and user feedback

### **Frontend Components**

- **`Withdrawal.jsx`**: Main withdrawal hub with balance display
- **`VirtualAccountWithdrawal.jsx`**: NGN/USD conversion interface
- **`CryptoWithdrawal.jsx`**: Crypto withdrawal interface
- **`WithdrawalHistory.jsx`**: Transaction history and status tracking

## Backend API Integration

### **Virtual Account Endpoints**

- **POST** `/api/accounts/withdrawal` - Process virtual account conversion
  - Parameters: `account` (usd/ngn), `amount`
  - Response: Success/failure with conversion details

### **Crypto Wallet Endpoints**

- **POST** `/api/wallet/withdraw` - Process crypto withdrawal
  - Parameters: `coin`, `to_address`, `amount`
  - Response: Transaction details and status
- **GET** `/api/wallet/transactions` - Get crypto transaction history

### **User Balance Endpoints**

- **GET** `/api/user` - Get user wallet balances
  - Returns: `wallet_naira`, `wallet_usd`, `virtual_accounts`

## User Experience

### **Withdrawal Flow**

#### **1. Main Withdrawal Screen**

1. User navigates to Withdrawal screen
2. System displays current NGN and USD balances
3. User selects withdrawal method (Virtual Account or Crypto)
4. User proceeds to specific withdrawal screen

#### **2. Virtual Account Withdrawal Flow**

1. User selects conversion type (NGN→USD or USD→NGN)
2. User enters amount to convert
3. System shows conversion preview with exchange rate
4. User confirms conversion
5. System processes instant conversion
6. User receives confirmation

#### **3. Crypto Withdrawal Flow**

1. User selects cryptocurrency (BTC, USDT, ETH, BNB)
2. User enters destination wallet address
3. User enters amount to withdraw
4. System validates address and calculates fees
5. User confirms withdrawal
6. System processes crypto transaction
7. User receives transaction hash and status

#### **4. Transaction History Flow**

1. User navigates to Withdrawal History
2. System fetches all withdrawal transactions
3. User can filter by type (All, Virtual Account, Crypto)
4. User can view transaction details and status
5. User can refresh for latest transactions

## Data Models

### **Withdrawal Request**

```javascript
{
  account: 'usd' | 'ngn', // For virtual account
  amount: number,
  coin: 'BTC' | 'USDT' | 'ETH' | 'BNB', // For crypto
  to_address: string // For crypto
}
```

### **Withdrawal Response**

```javascript
{
  success: boolean,
  message: string,
  data: {
    reference: string,
    amount: number,
    currency: string,
    status: 'pending' | 'completed' | 'failed',
    transaction_hash?: string, // For crypto
    created_at: string
  }
}
```

### **User Balance**

```javascript
{
  naira_balance: number,
  usd_balance: number,
  virtual_accounts: string | null
}
```

## Service Methods

### **Core Methods**

- `getUserBalance()`: Fetch user wallet balances
- `withdrawFromVirtualAccount(data)`: Process virtual account conversion
- `withdrawCrypto(data)`: Process crypto withdrawal
- `getWithdrawalHistory(type)`: Get transaction history

### **Validation Methods**

- `validateWithdrawalAmount(amount, currency, balance)`: Validate withdrawal amounts
- `validateCryptoWithdrawal(data)`: Validate crypto withdrawal data
- `validateWalletAddress(address, coin)`: Validate crypto wallet addresses

### **Utility Methods**

- `formatCurrency(amount, currency)`: Format currency display
- `getWithdrawalTypes()`: Get available withdrawal methods
- `getSupportedCryptos()`: Get supported cryptocurrencies
- `calculateConversion(amount, from, to, rate)`: Calculate conversions
- `getWithdrawalLimits(type)`: Get withdrawal limits
- `getWithdrawalStatus(status)`: Get status information
- `getWithdrawalFees(type, currency)`: Get fee information

## Validation Rules

### **Virtual Account Withdrawals**

- **NGN**: Minimum ₦100, maximum ₦1,000,000
- **USD**: Minimum $1, maximum $10,000
- **Balance Check**: Must have sufficient balance
- **Amount Validation**: Must be positive number

### **Crypto Withdrawals**

- **BTC**: Minimum 0.0001, maximum 10
- **USDT**: Minimum 1, maximum 100,000
- **ETH**: Minimum 0.001, maximum 100
- **BNB**: Minimum 0.01, maximum 1,000
- **Address Validation**: Must be valid wallet address format
- **Balance Check**: Must have sufficient crypto balance

## Error Handling

### **Network Errors**

- Graceful fallback with retry options
- User-friendly error messages
- Offline state handling

### **Validation Errors**

- Real-time field validation
- Clear error messages
- Input formatting assistance

### **API Errors**

- Backend error response handling
- Status code interpretation
- User guidance for resolution

## Security Considerations

### **Input Validation**

- Client-side validation for all inputs
- Server-side validation enforcement
- XSS and injection prevention

### **Transaction Security**

- Address validation before processing
- Balance verification
- Transaction confirmation dialogs

### **Data Privacy**

- Secure API communication
- No sensitive data logging
- User consent for transactions

## Performance Optimizations

### **Data Fetching**

- Efficient balance updates
- Cached transaction history
- Minimal API calls

### **UI Performance**

- Optimized rendering
- Smooth animations
- Responsive design

### **Memory Management**

- Proper component cleanup
- Efficient state management
- Image optimization

## User Interface

### **Design Principles**

- **Intuitive Navigation**: Clear flow between screens
- **Visual Feedback**: Loading states and confirmations
- **Error Prevention**: Validation and confirmation dialogs
- **Accessibility**: Screen reader support and high contrast

### **Visual Elements**

- **Balance Cards**: Prominent display of available funds
- **Status Indicators**: Clear transaction status display
- **Progress Indicators**: Loading and processing states
- **Color Coding**: Consistent color scheme for different states

## Testing

### **Unit Tests**

- Service method validation
- Utility function testing
- Error handling verification

### **Integration Tests**

- API endpoint integration
- Navigation flow testing
- Data persistence validation

### **User Acceptance Tests**

- Complete withdrawal journeys
- Edge case scenarios
- Performance under load

## Deployment Notes

### **Environment Configuration**

- API endpoint configuration
- Exchange rate settings
- Fee structure configuration

### **Monitoring**

- Transaction success rates
- Error tracking
- Performance metrics

## Troubleshooting

### **Common Issues**

1. **"Insufficient balance"**

   - Check available balance
   - Verify minimum withdrawal amounts
   - Check for pending transactions

2. **"Invalid wallet address"**

   - Verify address format
   - Check cryptocurrency type
   - Ensure address is not expired

3. **"Withdrawal failed"**

   - Check network connection
   - Verify API endpoint status
   - Contact support if issue persists

4. **"Conversion rate error"**
   - Check exchange rate service
   - Verify amount calculations
   - Retry with updated rates

### **Debug Mode**

Enable debug logging by setting `DEBUG=true` in environment variables.

## Support

For technical support or questions about the withdrawal integration:

- Check the troubleshooting section above
- Review API documentation
- Contact the development team
- Check system status page

## Changelog

### Version 1.0.0

- Initial withdrawal integration
- Virtual account conversions
- Crypto wallet withdrawals
- Transaction history tracking
- Real-time balance updates

### Future Versions

- Bank transfer withdrawals
- International wire transfers
- Scheduled withdrawals
- Withdrawal limits management
- Enhanced security features

## API Reference

### **Virtual Account Withdrawal**

```javascript
POST /api/accounts/withdrawal
{
  "account": "usd", // or "ngn"
  "amount": 100
}
```

### **Crypto Withdrawal**

```javascript
POST /api/wallet/withdraw
{
  "coin": "BTC",
  "to_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "amount": 0.001
}
```

### **Get User Balance**

```javascript
GET / api / user;
// Returns user profile with wallet balances
```

### **Get Transaction History**

```javascript
GET / api / wallet / transactions;
// Returns crypto transaction history
```

## Best Practices

### **For Developers**

- Always validate user inputs
- Implement proper error handling
- Use consistent naming conventions
- Follow security guidelines
- Test thoroughly before deployment

### **For Users**

- Double-check wallet addresses
- Verify amounts before confirming
- Keep transaction records
- Report issues promptly
- Use secure networks for transactions

## Future Enhancements

### **Planned Features**

- **Bank Transfer Integration**: Direct bank account withdrawals
- **International Transfers**: Cross-border withdrawal support
- **Scheduled Withdrawals**: Recurring withdrawal options
- **Withdrawal Limits**: User-configurable limits
- **Multi-Signature Wallets**: Enhanced security for large amounts

### **Advanced Features**

- **Withdrawal Analytics**: Spending insights and reports
- **Bulk Withdrawals**: Multiple recipient support
- **Withdrawal Templates**: Saved withdrawal configurations
- **Real-time Notifications**: Push notifications for status updates
- **Integration APIs**: Third-party service integration

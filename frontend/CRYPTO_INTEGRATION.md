# Crypto Integration Documentation

## Overview

This document outlines the complete cryptocurrency integration for the CashPoint mobile application, including backend API integration, frontend components, and user flows.

## Backend API Endpoints

### Crypto Types and Rates

- **GET** `/api/cryptos` - Get available cryptocurrency types
- **GET** `/api/crypto/rates` - Get current cryptocurrency rates

### Trading Operations

- **POST** `/api/crypto/buy` - Buy cryptocurrency
- **POST** `/api/crypto/sell` - Sell cryptocurrency
- **POST** `/api/crypto/buy-btc` - Buy BTC via Coinbase
- **POST** `/api/crypto/sell-btc` - Sell BTC via Coinbase

### Wallet Operations

- **POST** `/api/crypto/generate-address` - Generate wallet address for payment
- **POST** `/api/crypto/confirm-payment` - Confirm crypto payment
- **POST** `/api/wallet/create` - Create crypto wallet
- **POST** `/api/wallet/deposit` - Get deposit address
- **POST** `/api/wallet/withdraw` - Withdraw from wallet
- **GET** `/api/wallet/transactions` - Get wallet transactions

### History and Details

- **GET** `/api/crypto/history` - Get user's crypto transaction history
- **GET** `/api/crypto/history/{id}` - Get specific transaction details

## Frontend Components

### Services

- **`cryptoService.js`** - Main service for all crypto API calls and utilities

### Screens

- **`TradeCrypto.jsx`** - Main crypto trading screen with coin selection
- **`BuyCrypto.jsx`** - Buy cryptocurrency screen
- **`SellCrypto.jsx`** - Sell cryptocurrency screen
- **`FundWalletCrypto.jsx`** - Fund wallet with crypto screen
- **`CryptoHistory.jsx`** - Crypto transaction history screen
- **`CryptoDetails.jsx`** - Individual transaction details screen

## User Flows

### 1. Trading Flow

1. User navigates to Trade Crypto screen
2. System fetches available cryptocurrencies and current rates
3. User selects a cryptocurrency
4. System shows buy/sell options
5. User chooses buy or sell
6. User fills in transaction details
7. System validates and submits transaction
8. User receives confirmation

### 2. Buy Crypto Flow

1. User selects cryptocurrency from Trade Crypto screen
2. User chooses "Buy" option
3. User enters USD amount (minimum $10)
4. User enters wallet address
5. System calculates crypto amount to receive
6. User confirms transaction
7. System processes buy order
8. Cryptocurrency is sent to user's wallet

### 3. Sell Crypto Flow

1. User selects cryptocurrency from Trade Crypto screen
2. User chooses "Sell" option
3. User enters crypto amount to sell (minimum 0.001)
4. System calculates USD value
5. User confirms transaction
6. System processes sell order
7. User receives notification when processed

### 4. Fund Wallet with Crypto Flow

1. User navigates to Fund Wallet with Crypto
2. User selects cryptocurrency type
3. User enters NGN amount
4. User generates wallet address
5. System creates temporary wallet address
6. User sends crypto to generated address
7. System confirms payment and credits account

### 5. History and Details Flow

1. User navigates to Crypto History
2. System fetches user's transaction history
3. User can view transaction details
4. User can refresh to get latest transactions

## Data Models

### Crypto Model

```javascript
{
  id: number,
  name: string,
  symbol: string,
  usd_rate: number,
  logo: string,
  chain: string,
  is_active: boolean
}
```

### CryptoHistory Model

```javascript
{
  id: number,
  user_id: number,
  crypto_id: number,
  type: 'buy' | 'sell' | 'withdraw' | 'deposit',
  currency: string,
  amount: number,
  amount_crypto: number,
  naira_equivalent: number,
  wallet_address: string,
  transaction_hash: string,
  status: 'pending' | 'completed' | 'failed' | 'cancelled',
  created_at: string,
  updated_at: string
}
```

### WalletAddress Model

```javascript
{
  id: number,
  user_id: number,
  coin: string,
  address: string,
  expires_at: string
}
```

## API Request/Response Examples

### Get Crypto Types

```javascript
// Request
GET /api/cryptos

// Response
{
  "message": "Data retrieved successfully",
  "success": true,
  "results": {
    "data": [
      {
        "id": 1,
        "name": "Bitcoin",
        "symbol": "BTC",
        "usd_rate": 60000,
        "logo": null,
        "chain": "btc",
        "is_active": true
      }
    ]
  }
}
```

### Buy Crypto

```javascript
// Request
POST /api/crypto/buy
{
  "crypto_id": 1,
  "amount_usd": 100,
  "wallet_address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}

// Response
{
  "message": "Crypto sent",
  "trade": {
    "id": 123,
    "user_id": 1,
    "crypto_id": 1,
    "type": "buy",
    "amount": 100,
    "amount_crypto": 0.00166667,
    "status": "completed"
  }
}
```

### Sell Crypto

```javascript
// Request
POST /api/crypto/sell
{
  "crypto_id": 1,
  "amount_crypto": 0.001
}

// Response
{
  "message": "Crypto trade submitted",
  "status": true,
  "results": {
    "data": {
      "id": 124,
      "user_id": 1,
      "crypto_id": 1,
      "type": "sell",
      "amount": 60,
      "amount_crypto": 0.001,
      "status": "pending"
    }
  }
}
```

## Error Handling

### Common Error Scenarios

1. **Network Errors** - Display user-friendly error messages
2. **Validation Errors** - Show specific field validation messages
3. **API Errors** - Handle backend error responses gracefully
4. **Timeout Errors** - Provide retry options

### Error Response Format

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": "Specific error message"
  }
}
```

## Validation Rules

### Buy Crypto Validation

- `crypto_id`: Required, must exist in cryptos table
- `amount_usd`: Required, minimum $10
- `wallet_address`: Required, minimum 10 characters

### Sell Crypto Validation

- `crypto_id`: Required, must exist in cryptos table
- `amount_crypto`: Required, minimum 0.001

### Wallet Address Generation Validation

- `coin`: Required, must be one of: USDT, BTC, BNB
- `amount_ngn`: Required, minimum ₦1

## Security Considerations

1. **Authentication** - All endpoints require valid auth token
2. **Input Validation** - Client and server-side validation
3. **Rate Limiting** - Prevent abuse of API endpoints
4. **Secure Storage** - Sensitive data encrypted in storage
5. **Transaction Verification** - Blockchain transaction verification

## Performance Optimizations

1. **Caching** - Cache crypto rates and types
2. **Lazy Loading** - Load transaction history on demand
3. **Pagination** - Implement pagination for large datasets
4. **Optimistic Updates** - Update UI before API confirmation
5. **Background Refresh** - Refresh rates in background

## Testing

### Unit Tests

- Service functions
- Validation logic
- Utility functions

### Integration Tests

- API endpoint integration
- Navigation flows
- Error handling

### User Acceptance Tests

- Complete user journeys
- Edge cases
- Performance under load

## Deployment Notes

1. **Environment Variables** - Configure API endpoints
2. **API Keys** - Set up crypto service API keys
3. **Webhook URLs** - Configure payment confirmation webhooks
4. **Rate Limits** - Set appropriate rate limits
5. **Monitoring** - Set up error tracking and analytics

## Future Enhancements

1. **Real-time Updates** - WebSocket integration for live rates
2. **Advanced Trading** - Limit orders, stop losses
3. **Portfolio Tracking** - Track crypto holdings
4. **Price Alerts** - Notify users of price changes
5. **Multi-wallet Support** - Support for multiple wallet types
6. **DeFi Integration** - Connect with DeFi protocols
7. **NFT Support** - Buy/sell NFTs
8. **Staking** - Crypto staking functionality

## Troubleshooting

### Common Issues

1. **"Failed to load cryptocurrency data"**

   - Check network connection
   - Verify API endpoint configuration
   - Check authentication token

2. **"Invalid wallet address"**

   - Verify address format
   - Check if address is for correct cryptocurrency
   - Ensure address is not expired

3. **"Transaction failed"**

   - Check transaction hash validity
   - Verify blockchain confirmation
   - Contact support if issue persists

4. **"Insufficient balance"**
   - Check user's crypto balance
   - Verify minimum transaction amounts
   - Check for pending transactions

### Debug Mode

Enable debug logging by setting `DEBUG=true` in environment variables.

## Support

For technical support or questions about the crypto integration:

- Check the troubleshooting section above
- Review API documentation
- Contact the development team
- Check system status page

## Changelog

### Version 1.0.0

- Initial crypto integration
- Basic buy/sell functionality
- Wallet address generation
- Transaction history
- Real-time rate updates

### Future Versions

- Advanced trading features
- DeFi integration
- Multi-chain support
- Enhanced security features

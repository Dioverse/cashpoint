import api from './api';

class CryptoService {
  /**
   * Get available crypto types
   * @returns {Promise} API response with crypto types
   */
  async getCryptoTypes() {
    try {
      console.log('Fetching crypto types...');
      const response = await api.get('/cryptos');
      console.log('Crypto types response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto types error:', error);
      throw error;
    }
  }

  /**
   * Get current crypto rates
   * @returns {Promise} API response with crypto rates
   */
  async getCryptoRates() {
    try {
      console.log('Fetching crypto rates...');

      // Check if we have a token
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Token exists:', !!token);
      console.log('Token value:', token);

      const response = await api.get('/crypto/rates');
      console.log('Crypto rates response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto rates error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Return fallback rates if API fails
      return {
        status: false,
        results: {
          data: {
            BTC: 60000,
            USDT: 1,
            BNB: 300,
          },
        },
      };
    }
  }

  /**
   * Buy crypto
   * @param {Object} data - Buy data
   * @param {number} data.crypto_id - Crypto ID
   * @param {number} data.amount_usd - Amount in USD
   * @param {string} data.wallet_address - Wallet address
   * @returns {Promise} API response
   */
  async buyCrypto(data) {
    try {
      console.log('Buying crypto with data:', data);
      const response = await api.post('/crypto/buy', data);
      console.log('Buy crypto response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Buy crypto error:', error);
      // Return a consistent error format
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to buy crypto');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Sell crypto
   * @param {Object} data - Sell data
   * @param {number} data.crypto_id - Crypto ID
   * @param {number} data.amount_crypto - Amount of crypto to sell
   * @returns {Promise} API response
   */
  async sellCrypto(data) {
    try {
      console.log('Selling crypto with data:', data);
      const response = await api.post('/crypto/sell', data);
      console.log('Sell crypto response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Sell crypto error:', error);
      // Return a consistent error format
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Failed to sell crypto');
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Generate wallet address for crypto payment
   * @param {Object} data - Wallet data
   * @param {string} data.coin - Coin type (USDT, BTC, BNB)
   * @param {number} data.amount_ngn - Amount in NGN
   * @returns {Promise} API response
   */
  async generateWalletAddress(data) {
    try {
      const response = await api.post('/crypto/generate-address', data);
      return response.data;
    } catch (error) {
      console.error('Generate wallet address error:', error);
      throw error;
    }
  }

  /**
   * Confirm crypto payment
   * @param {Object} data - Payment confirmation data
   * @param {string} data.wallet_address - Wallet address
   * @param {string} data.tx_hash - Transaction hash
   * @returns {Promise} API response
   */
  async confirmPayment(data) {
    try {
      const response = await api.post('/crypto/confirm-payment', data);
      return response.data;
    } catch (error) {
      console.error('Confirm payment error:', error);
      throw error;
    }
  }

  /**
   * Get user's crypto transaction history
   * @returns {Promise} API response with crypto history
   */
  async getCryptoHistory() {
    try {
      console.log('Fetching crypto history...');
      const response = await api.get('/crypto/history');
      console.log('Crypto history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto history error:', error);
      throw error;
    }
  }

  /**
   * Get specific crypto transaction details
   * @param {number} id - Transaction ID
   * @returns {Promise} API response with transaction details
   */
  async getCryptoDetails(id) {
    try {
      console.log('Fetching crypto details for ID:', id);
      const response = await api.get(`/crypto/history/${id}`);
      console.log('Crypto details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get crypto details error:', error);
      throw error;
    }
  }

  /**
   * Buy BTC using Coinbase
   * @param {Object} data - Buy data
   * @param {number} data.amount_usd - Amount in USD
   * @returns {Promise} API response
   */
  async buyBTC(data) {
    try {
      const response = await api.post('/crypto/buy-btc', data);
      return response.data;
    } catch (error) {
      console.error('Buy BTC error:', error);
      throw error;
    }
  }

  /**
   * Sell BTC using Coinbase
   * @param {Object} data - Sell data
   * @param {number} data.amount_btc - Amount of BTC to sell
   * @returns {Promise} API response
   */
  async sellBTC(data) {
    try {
      const response = await api.post('/crypto/sell-btc', data);
      return response.data;
    } catch (error) {
      console.error('Sell BTC error:', error);
      throw error;
    }
  }

  /**
   * Create crypto wallet
   * @param {Object} data - Wallet data
   * @param {string} data.coin - Coin type
   * @returns {Promise} API response
   */
  async createWallet(data) {
    try {
      const response = await api.post('/wallet/create', data);
      return response.data;
    } catch (error) {
      console.error('Create wallet error:', error);
      throw error;
    }
  }

  /**
   * Get wallet deposit address
   * @param {Object} data - Deposit data
   * @param {string} data.coin - Coin type
   * @returns {Promise} API response
   */
  async getDepositAddress(data) {
    try {
      const response = await api.post('/wallet/deposit', data);
      return response.data;
    } catch (error) {
      console.error('Get deposit address error:', error);
      throw error;
    }
  }

  /**
   * Withdraw from wallet
   * @param {Object} data - Withdraw data
   * @param {string} data.coin - Coin type
   * @param {string} data.to_address - Destination address
   * @param {number} data.amount - Amount to withdraw
   * @returns {Promise} API response
   */
  async withdrawFromWallet(data) {
    try {
      console.log('Withdrawing from wallet with data:', data);
      const response = await api.post('/wallet/withdraw', data);
      console.log('Withdraw response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Withdraw from wallet error:', error);
      // Return a consistent error format
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || 'Failed to withdraw from wallet',
        );
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  /**
   * Get wallet transactions
   * @returns {Promise} API response with wallet transactions
   */
  async getWalletTransactions() {
    try {
      const response = await api.get('/wallet/transactions');
      return response.data;
    } catch (error) {
      console.error('Get wallet transactions error:', error);
      throw error;
    }
  }

  /**
   * Validate crypto buy data
   * @param {Object} data - Buy data to validate
   * @returns {Object} Validation result
   */
  validateBuyData(data) {
    const errors = {};

    if (!data.crypto_id) {
      errors.crypto_id = 'Please select a cryptocurrency';
    }
    if (!data.amount_usd || data.amount_usd < 10) {
      errors.amount_usd = 'Amount must be at least $10';
    }
    if (!data.wallet_address) {
      errors.wallet_address = 'Wallet address is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate crypto sell data
   * @param {Object} data - Sell data to validate
   * @returns {Object} Validation result
   */
  validateSellData(data) {
    const errors = {};

    if (!data.crypto_id) {
      errors.crypto_id = 'Please select a cryptocurrency';
    }
    if (!data.amount_crypto || data.amount_crypto < 0.001) {
      errors.amount_crypto = 'Amount must be at least 0.001';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate wallet address generation data
   * @param {Object} data - Wallet data to validate
   * @returns {Object} Validation result
   */
  validateWalletData(data) {
    const errors = {};

    if (!data.coin) {
      errors.coin = 'Please select a coin type';
    }
    if (!data.amount_ngn || data.amount_ngn < 1) {
      errors.amount_ngn = 'Amount must be at least ₦1';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Format crypto amount for display
   * @param {number} amount - Amount to format
   * @param {string} symbol - Crypto symbol
   * @returns {string} Formatted amount
   */
  formatCryptoAmount(amount, symbol) {
    if (!amount) return '0.00';

    const decimals = symbol === 'BTC' ? 8 : 2;
    return parseFloat(amount).toFixed(decimals);
  }

  /**
   * Format USD amount for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  formatUSDAmount(amount) {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  }

  /**
   * Format NGN amount for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  formatNGNAmount(amount) {
    if (!amount) return '₦0.00';
    return `₦${parseFloat(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
    })}`;
  }

  /**
   * Get transaction status color
   * @param {string} status - Transaction status
   * @returns {string} Color code
   */
  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      case 'cancelled':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  }

  /**
   * Get transaction status text
   * @param {string} status - Transaction status
   * @returns {string} Status text
   */
  getStatusText(status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get transaction type text
   * @param {string} type - Transaction type
   * @returns {string} Type text
   */
  getTypeText(type) {
    switch (type?.toLowerCase()) {
      case 'buy':
        return 'Buy';
      case 'sell':
        return 'Sell';
      case 'withdraw':
        return 'Withdraw';
      case 'deposit':
        return 'Deposit';
      default:
        return 'Transaction';
    }
  }

  /**
   * Calculate conversion rate
   * @param {number} amount - Amount to convert
   * @param {number} rate - Conversion rate
   * @returns {number} Converted amount
   */
  calculateConversion(amount, rate) {
    if (!amount || !rate) return 0;
    return amount * rate;
  }

  /**
   * Get supported coin types
   * @returns {Array} Array of supported coins
   */
  getSupportedCoins() {
    return [
      {label: 'Bitcoin', value: 'BTC', symbol: 'BTC'},
      {label: 'Tether', value: 'USDT', symbol: 'USDT'},
      {label: 'Binance Coin', value: 'BNB', symbol: 'BNB'},
    ];
  }

  /**
   * Test API connection with token
   * @returns {Promise} Test response
   */
  async testApiConnection() {
    try {
      console.log('Testing API connection...');
      const response = await api.get('/user');
      console.log('API test response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API test error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  }
}

export default new CryptoService();

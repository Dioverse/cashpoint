import api from './api';

class CryptoService {
  /**
   * Get available crypto types
   * @returns {Promise} API response with crypto types
   */
  async getCryptoTypes() {
    try {
      const response = await api.get('/cryptos');
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
      const response = await api.get('/crypto/rates');
      return response.data;
    } catch (error) {
      console.error('Get crypto rates error:', error);
      throw error;
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
      const response = await api.post('/crypto/buy', data);
      return response.data;
    } catch (error) {
      console.error('Buy crypto error:', error);
      throw error;
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
      const response = await api.post('/crypto/sell', data);
      return response.data;
    } catch (error) {
      console.error('Sell crypto error:', error);
      throw error;
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
      const response = await api.get('/crypto/history');
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
      const response = await api.get(`/crypto/history/${id}`);
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
      const response = await api.post('/wallet/withdraw', data);
      return response.data;
    } catch (error) {
      console.error('Withdraw from wallet error:', error);
      throw error;
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
}

export default new CryptoService();

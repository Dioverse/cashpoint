import api from './api';

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  },

  sendOTP: async (data) => {
    try {
      const response = await api.post('/otp', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },


  resendOTP: async () => { // The /resend endpoint typically doesn't need a payload if user is authenticated
    try {
      const response = await api.post('/resend');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to resend OTP' };
    }
  },

  verifyOTP: async (otp) => {
    try {
      const response = await api.post('/verify', { otp });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  createPin: async (pin) => {
    try {
      const response = await api.post('/create-pin', { pin });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  resetPin: async (data) => {
    try {
      const response = await api.post('/reset-pin', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getUser: async () => {
    try {
      const response = await api.get('/user');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  generateWallet: async () => {
    try {
      const response = await api.post('/user/generate-wallet');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  resetOtp: async (email) => {
    try {
      const response = await api.post('/reset/otp', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await api.post('/reset/password', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};

// Giftcard APIs
export const giftcardAPI = {
  sell: async (giftcardData) => {
    try {
      const response = await api.post('/giftcard/sell', giftcardData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  buy: async (giftcardData) => {
    try {
      const response = await api.post('/giftcard/buy', giftcardData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getTypes: async () => {
    try {
      const response = await api.get('/giftcard/types');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getRates: async () => {
    try {
      const response = await api.get('/giftcard/rates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getHistory: async () => {
    try {
      const response = await api.get('/giftcard/history');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getDetails: async (id) => {
    try {
      const response = await api.get(`/giftcard/history/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};

// Crypto APIs
export const cryptoAPI = {
  sell: async (cryptoData) => {
    try {
      const response = await api.post('/crypto/sell', cryptoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  buy: async (cryptoData) => {
    try {
      const response = await api.post('/crypto/buy', cryptoData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  generateAddress: async (data) => {
    try {
      const response = await api.post('/crypto/generate-address', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  confirmPayment: async (data) => {
    try {
      const response = await api.post('/crypto/confirm-payment', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getRates: async () => {
    try {
      const response = await api.get('/crypto/rates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};

// Virtual Account APIs
export const virtualAccountAPI = {
  create: async (data) => {
    try {
      const response = await api.post('/accounts/create', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  withdraw: async (data) => {
    try {
      const response = await api.post('/accounts/withdrawal', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};

// Notification APIs
export const notificationAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/notifications');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.post(`/notifications/${id}/mark-read`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/mark-all-read');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
};
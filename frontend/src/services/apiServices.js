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


  // Update your resendOTP function to ensure the payload format is correct
resendOTP: async (email) => {
  try {
    // Send the email inside the payload
    const response = await api.post('/resend', { email });
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

  createPin: async (pin, confirmPin) => {
    try {
      // Send the POST request with pin and pin_confirmation in the body
      const response = await api.post('/create-pin', {
        pin,
        pin_confirmation: confirmPin,
      });
      return response.data;  // Return the response data from the backend
    } catch (error) {
      console.error('Error creating PIN:', error);
      throw error;  // Propagate the error to be handled elsewhere
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
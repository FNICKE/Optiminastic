import axios from 'axios';

const BACKEND_URL = 'https://wallet-system1.netlify.app/';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const clientId = localStorage.getItem('clientId');
  if (clientId) {
    config.headers['client-id'] = clientId;
  }
  return config;
});

export const setClientId = (id) => {
  localStorage.setItem('clientId', id);
};

export const getClientId = () => localStorage.getItem('clientId');

// Wallet
export const getBalance     = () => api.get('/wallet/balance');
export const getTransactionHistory = () => api.get('/wallet/history');   // ← NEW

// Orders
export const createOrder    = (amount) => api.post('/orders', { amount });
export const getOrder       = (orderId) => api.get(`/orders/${orderId}`);

// Admin
export const adminCredit = (clientId, amount) =>
  api.post('/admin/wallet/credit', { client_id: clientId, amount }, {
    headers: { 'x-admin-secret': 'admin-secret-123' }
  });

export const adminDebit = (clientId, amount) =>
  api.post('/admin/wallet/debit', { client_id: clientId, amount }, {
    headers: { 'x-admin-secret': 'admin-secret-123' }
  });

export default api;

import axios from 'axios';
import { getToken } from './authService';


const API_URL = 'http://localhost:5001';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTransactions = async (type = '') => {
  const endpoint = type ? `/transactions/type/${type}` : '/transactions';
  const response = await apiClient.get(endpoint);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await apiClient.delete(`/transactions/${id}`);
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await apiClient.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await apiClient.post('/transactions', transaction);
  return response;
};

export const updateTransaction = async (id, transaction) => {
  const response = await apiClient.put(`/transactions/${id}`, transaction);
  return response;
};
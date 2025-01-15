import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5003/budgets';

export const addBudget = async (budgetData) => {
  const token = getToken();
  const response = await axios.post(API_URL, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBudgets = async () => {
    const token = getToken();
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

export const getBudgetById = async (id) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateBudget = async (id, budgetData) => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/${id}`, budgetData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteBudget = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
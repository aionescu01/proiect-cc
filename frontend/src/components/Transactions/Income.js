import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getTransactions,
  deleteTransaction,
} from '../../services/transactionService';
import { formatDate, formatDateForEdit } from '../utils/dateUtils';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await getTransactions('income');
        const formattedAndSortedData = data
        .map((entry) => ({
          ...entry,
          date: formatDateForEdit(entry.date), 
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); 

        setIncomes(formattedAndSortedData); 
      } catch (error) {
        console.error(error);
        alert('Error fetching incomes');
      }
    };

    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setIncomes(incomes.filter((income) => income.id !== id));
      alert('Income deleted.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete income.');
    }
  };

  return (
    <div>
      <h2>Your Income</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id}>
              <td>{formatDate(income.date)}</td>
              <td>{income.description}</td>
              <td>{income.amount}</td>
              <td>{income.category}</td>
              <td>
                <button onClick={() => navigate(`/edit-income/${income.id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(income.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Income;
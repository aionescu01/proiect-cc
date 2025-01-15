import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getTransactions,
  deleteTransaction,
} from '../../services/transactionService';
import { formatDate, formatDateForEdit } from '../utils/dateUtils';


const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        
        const data = await getTransactions('expense');
        const formattedAndSortedData = data
        .map((entry) => ({
          ...entry,
          date: formatDateForEdit(entry.date), 
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); 

        setExpenses(formattedAndSortedData); 

      } catch (error) {
        console.error(error);
        alert('Error fetching expenses');
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
      alert('Transaction deleted.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete transaction.');
    }
  };

  return (
    <div>
      <h2>Your Expenses</h2>
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
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>
                <button onClick={() => navigate(`/edit-expense/${expense.id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(expense.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;
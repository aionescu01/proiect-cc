import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBudgets,
  deleteBudget,
} from '../../services/budgetService';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await getBudgets();
        setBudgets(data.budgets);
      } catch (error) {
        console.error(error);
        alert('Error fetching budgets');
      }
    };

    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter((budget) => budget.id !== id));
      alert('Budget deleted.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete budget.');
    }
  };

  return (
    <div>
      <h2>Your Budgets</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Limit</th>
            <th>Alert Threshold (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              <td>{budget.category}</td>
              <td>{budget.limit}</td>
              <td>{budget.alert_threshold}</td>
              <td>
                <button onClick={() => navigate(`/edit-budget/${budget.id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(budget.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Budgets;
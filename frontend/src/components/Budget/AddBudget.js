import React, { useState } from 'react';
import { addBudget } from '../../services/budgetService';
import { useNavigate } from 'react-router-dom';

const AddBudget = () => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const budgetData = {
      category: category,
      limit_sum: parseFloat(limit),
      alert_threshold: parseFloat(alertThreshold),
    };

    try {
        console.log(budgetData);
      await addBudget(budgetData);
      alert('Budget created successfully');
      navigate('/budgets');
    } catch (error) {
      console.error(error);
      alert('Error creating budget');
    }
  };

  return (
    <div>
      <h2>New Budget</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Limit:</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Alert Threshold (%):</label>
          <input
            type="number"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Budget</button>
      </form>
    </div>
  );
};

export default AddBudget;
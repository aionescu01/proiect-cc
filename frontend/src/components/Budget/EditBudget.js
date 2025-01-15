import React, { useState, useEffect } from 'react';
import { getBudgetById, updateBudget } from '../../services/budgetService';
import { useNavigate, useParams } from 'react-router-dom';

const EditBudget = () => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBudget = async () => {
      try {
       
        const budget = await getBudgetById(id);
        setCategory(budget.category);
        setLimit(budget.limit);
        setAlertThreshold(budget.alert_threshold);
      } catch (error) {
        console.error(error);
        alert('Error fetching budget details');
      }
    };

    fetchBudget();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBudget = {
      category,
      limit: parseFloat(limit),
      alert_threshold: parseFloat(alertThreshold),
    };

    try {
      await updateBudget(id, updatedBudget);
      alert('Budget updated successfully');
      navigate('/budgets');
    } catch (error) {
      console.error(error);
      alert('Error updating budget');
    }
  };

  return (
    <div>
      <h2>Edit Budget</h2>
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
        <button type="submit">Update Budget</button>
      </form>
    </div>
  );
};

export default EditBudget;

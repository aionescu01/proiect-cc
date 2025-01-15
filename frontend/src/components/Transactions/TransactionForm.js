import React, { useState } from 'react';

const TransactionForm = ({ isEdit = false, data = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    ...data, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    onSubmit(transactionData);
  };

  return (
    <form onSubmit={handleSubmit}>
        <div>
      <label>
        Date:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>
      </div>
      <div>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </label>
      </div>
      <div>
      <label>
        Amount:
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </label>
      </div>
      <div>
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </label>
      </div>
      <div>
      <label>
        Type:
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      </div>
      <button type="submit">{isEdit ? 'Update Transaction' : 'Add Transaction'}</button>
    </form>
  );
};

export default TransactionForm;
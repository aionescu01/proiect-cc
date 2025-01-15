import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import {createTransaction} from '../../services/transactionService'

const AddTransaction = () => {
  const navigate = useNavigate();
  
  const handleCreate = async (newTransaction) => {
    const response = await createTransaction(newTransaction);
      if(newTransaction.type==="income"){
          if (response.status === 200) {
          alert(`Transaction added successfully!`);
          }
          else{
          alert('Failed to update transaction.');
          }
          navigate('/income');
      }else{
        if (response.status === 200) {
        const message = response.data.budget_status.message;
        alert(`Transaction added successfully! Budget status: ${message}`);
        }else{
          alert('Failed to update transaction.');
        }
        navigate('/expenses');
      }
    
    

  };

  return <TransactionForm isEdit={false} onSubmit={handleCreate} />;
};

export default AddTransaction;
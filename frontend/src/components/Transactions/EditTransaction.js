import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import { getTransactionById, updateTransaction } from '../../services/transactionService';
import { formatDateForEdit } from '../utils/dateUtils';

const EditTransaction = (props) => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      const data = await getTransactionById(id);
      setTransaction({
        ...data,
        date: formatDateForEdit(data.date),
      });
    };

    fetchTransaction();
  }, [id]);

  const handleUpdate = async (updatedTransaction) => {
    

      const response = await updateTransaction(id, updatedTransaction);
      console.log(response);
      if (response.status === 200) {

      if(props.transactionType==="income"){
          
        alert(`Transaction updated successfully!`);
      }else{
        const message = response.data.budget_check.message;
        alert(`Transaction update successfully! Budget status: ${message}`);
      }
    }
    else{
    alert('Failed to update transaction.');
    }
    navigate(props.returnTo);
  };

  return transaction ? (
    <TransactionForm isEdit={true} data={transaction} onSubmit={handleUpdate} />
  ) : (
    <p>Loading...</p>
  );
};

export default EditTransaction;
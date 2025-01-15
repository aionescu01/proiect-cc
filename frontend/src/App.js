import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Logout from './components/Auth/Logout';
import Profile from './components/Auth/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Expenses from './components/Transactions/Expenses';
import AddTransaction from './components/Transactions/AddTransaction';
import Navbar from './Navbar';
import { AuthProvider } from './components/Auth/AuthContext';
import EditTransaction from './components/Transactions/EditTransaction';
import EditBudget from './components/Budget/EditBudget';
import AddBudget from './components/Budget/AddBudget';
import Budgets from './components/Budget/Budgets';
import EditExpense from './components/Transactions/EditExpense';
import EditIncome from './components/Transactions/EditIncome';
import Income from './components/Transactions/Income';


function App() {
  return (
    <AuthProvider>
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expenses" element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>}/>
        <Route path="/profile"element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>}/>
        <Route path="/add-transaction"element={
            <ProtectedRoute>
              <AddTransaction />
            </ProtectedRoute>}/>  
        <Route path="/edit-transaction/:id"element={
            <ProtectedRoute>
              <EditTransaction />
            </ProtectedRoute>}/>
        <Route path="/edit-expense/:id"element={
            <ProtectedRoute>
              <EditExpense />
            </ProtectedRoute>}/>  
        <Route path="/edit-income/:id"element={
            <ProtectedRoute>
              <EditIncome />
            </ProtectedRoute>}/>
        <Route path="/budgets"element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>}/>
        <Route path="/income"element={
            <ProtectedRoute>
              <Income />
            </ProtectedRoute>}/>
        <Route path="/add-budget"element={
            <ProtectedRoute>
              <AddBudget />
            </ProtectedRoute>}/>      
        <Route path="/edit-budget/:id"element={
            <ProtectedRoute>
              <EditBudget />
            </ProtectedRoute>}/>  
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

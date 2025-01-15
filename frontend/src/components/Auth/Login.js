import React, {useContext} from 'react';
import { useForm } from 'react-hook-form';
//import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);


  const onSubmit = async (data) => {
    try {
      await login(data);
      alert('Login successful');
      navigate('/expenses');
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
        <input {...register('username')} placeholder="Username" required />
        </div>
        <div>
        <input {...register('password')} type="password" placeholder="Password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
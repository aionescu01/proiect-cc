import React from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
      try {
        await registerUser(data);
        alert('Registration successful');
        navigate('/login');
      } catch (error) {
        console.error(error);
        alert('Error registering user');
      }
    };

return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
        <input {...register('username')} placeholder="Username" required />
        </div>
        <div>
        <input {...register('email')} type="email" placeholder="Email" required />
        </div>
        <div>
        <input {...register('password')} type="password" placeholder="Password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
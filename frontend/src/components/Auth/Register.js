import React from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../services/authService';

const Register = () => {
    const { register, handleSubmit } = useForm();
  
    const onSubmit = async (data) => {
      try {
        await registerUser(data);
        alert('Registration successful');
      } catch (error) {
        console.error(error);
        alert('Error registering user');
      }
    };

return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('username')} placeholder="Username" required />
        <input {...register('email')} type="email" placeholder="Email" required />
        <input {...register('password')} type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
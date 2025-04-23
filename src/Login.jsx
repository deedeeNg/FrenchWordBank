import React, { useState } from 'react';
import { getDatabase, ref, get, child } from 'firebase/database';

const Login = ({ onLogin, toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter valid username and password');
      return;
    }

    try {
      const db = getDatabase();
      const snapshot = await get(child(ref(db), 'users'));

      if (snapshot.exists()) {
        const users = snapshot.val();
        const foundUser = Object.entries(users).find(
          ([, value]) =>
            value.username === username && value.password === password
        );

        if (foundUser) {
          onLogin(username, password);
        } else {
          setError('Invalid username or password');
        }
      } else {
        setError('No users found in database');
      }
    } catch (err) {
      console.error('Firebase error:', err);
      setError('An error occurred while logging in');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-2 border rounded mt-2" 
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border rounded mt-2" 
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
          Login
        </button>
      </form>

      <p className="text-center mt-4">
        Don't have an account?{' '}
        <button onClick={toggleForm} className="text-blue-500">Register</button>
      </p>
    </div>
  );
};

export default Login;

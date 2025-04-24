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
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-semibold">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700 transition-all duration-300">
          Log In
        </button>
      </form>
      <p className="text-center mt-4">
        Don't have an account?{' '}
        <button onClick={toggleForm} className="text-blue-600 font-semibold">Register</button>
      </p>
    </div>
  );
};

export default Login;

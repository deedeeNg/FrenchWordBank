import React, { useState } from 'react';
import { database, ref, set , get} from './firebase'; // Import Firebase functions

const Register = ({ onRegister, toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Check if username already exists in the database
    const userRef = ref(database, 'users/' + username);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      setError('Username already taken!');
      return;
    }

    // Save user data to Firebase Realtime Database
    await set(userRef, {
      username: username,
      password: password, // In a real-world app, never store plain passwords
    });

    // After successful registration, call onRegister to log the user in
    onRegister(username, password);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
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

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="w-full p-2 border rounded mt-2" 
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
          Register
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{' '}
        <button onClick={toggleForm} className="text-blue-500">Login</button>
      </p>
    </div>
  );
};

export default Register;

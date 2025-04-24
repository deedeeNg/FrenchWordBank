import React, { useState } from 'react';
import { database, ref, set, get } from './firebase'; // Import Firebase functions

const Register = ({ onRegister, toggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const [success, setSuccess] = useState(false); // Added success state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true); // Start loading
    setError(''); // Clear previous error

    try {
      // Check if username already exists in the database
      const userRef = ref(database, 'users/' + username);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setError('Username already taken!');
        setLoading(false); // Stop loading if there is an error
        return;
      }

      // Save user data to Firebase Realtime Database
      await set(userRef, {
        username: username,
        password: password, // In a real-world app, never store plain passwords
      });

      setSuccess(true); // Set success message
      setLoading(false); // Stop loading

      // After successful registration, call onRegister to log the user in
      onRegister(username, password);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false); // Stop loading if there's an error
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Create Account</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">Account created successfully!</p>}

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
            disabled={loading} // Disable input while loading
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
            disabled={loading} // Disable input while loading
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading} // Disable input while loading
          />
        </div>
        <button
          type="submit"
          className={`w-full p-3 rounded-lg mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-all duration-300`}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{' '}
        <button onClick={toggleForm} className="text-blue-600 font-semibold">Log In</button>
      </p>
    </div>
  );
};

export default Register;

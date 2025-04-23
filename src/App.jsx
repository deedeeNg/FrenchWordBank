import React, { useState, useEffect } from 'react';
import AddWordForm from './AddWordForm';
import WordBank from './WordBank';
import Login from './Login';
import Register from './Register'; // ⬅️ Create this component
import { database, ref, set, get, child} from './firebase'; // adjust path if needed


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [words, setWords] = useState([]);
  const [editingWord, setEditingWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load word bank from Firebase
  useEffect(() => {
    if (username) {
      const dbRef = ref(database);
      get(child(dbRef, `users/${username}/wordBank`)).then((snapshot) => {
        if (snapshot.exists()) {
          setWords(snapshot.val());
        } else {
          setWords([]);
        }
      });
    }
  }, [username]);

  // Save to Firebase when words change
  useEffect(() => {
    if (username && words.length > 0) {
      set(ref(database, `users/${username}/wordBank`), words);
    }
  }, [words, username]);

  // Add or update a word
  const addWord = (newWord) => {
    const isDuplicate = words.some(
      (word) => word.french.toLowerCase() === newWord.french.toLowerCase()
    );

    if (isDuplicate && !editingWord) {
      alert('⚠️ This word already exists in your word bank!');
    } else if (editingWord) {
      const updatedWords = words.map((word, index) =>
        index === editingWord.index ? newWord : word
      );
      setWords(updatedWords);
      setEditingWord(null);
    } else {
      setWords([...words, newWord]);
    }
  };

  // Start editing a word
  const startEditing = (index) => {
    setEditingWord({ ...words[index], index });
  };

  // Deleting a word
  const deleteWord = (indexToDelete) => {
    const userRef = ref(database, `users/${username}/wordBank`);
    const updatedWords = words.filter((_, index) => index !== indexToDelete);
  
    // Update Firebase with filtered words
    set(updatedWords.length > 0 ? userRef : ref(database, `users/${username}/wordBank`), updatedWords)
      .then(() => {
        setWords(updatedWords);
      })
      .catch((error) => {
        console.error('Error deleting word:', error);
      });
  };

  // Filtering Words
  const filteredWords = words.filter((word) => {
    const term = searchTerm.toLowerCase();
    return (
      word.french.toLowerCase().startsWith(term) ||
      word.english.toLowerCase().startsWith(term)
    );
  });

  // Handle login (for simplicity, you can check if username and password exist)
  const handleLogin = (enteredUsername, enteredPassword) => {
    // You can extend this with actual authentication logic with Firebase or any backend
    if (enteredUsername && enteredPassword) {
      setUsername(enteredUsername);
      setPassword(enteredPassword);
      setLoggedIn(true);
      setIsRegistering(false);
    } else {
      alert('Please enter valid username and password');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setWords([]);
    setEditingWord(null);
    setSearchTerm('');
    setIsRegistering(false);
  };

  // Show login/register page if not logged in
  if (!loggedIn) {
    return isRegistering ? (
      <Register onRegister={handleLogin} toggleForm={() => setIsRegistering(false)} />
    ) : (
      <Login onLogin={handleLogin} toggleForm={() => setIsRegistering(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-blue-100">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          📘 French Vocab Word Bank
        </h1>
        <div className="flex justify-between items-center mb-6">
        <span className="text-lg text-gray-700">
          👋 Hello, <strong>{username}</strong>
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log out
        </button>
      </div>
        <AddWordForm addWord={addWord} editingWord={editingWord} />
        <div className="mt-6">
        <input
          type="text"
          placeholder="🔍 Search words..."
          className="border border-blue-300 rounded p-2 w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
          <WordBank words={filteredWords} onEdit={startEditing} onDelete={deleteWord} />
        </div>
      </div>
    </div>
  );
}

export default App;

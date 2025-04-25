import React, { useState, useEffect } from 'react';
import AddWordForm from './AddWordForm';
import WordBank from './WordBank';
import Login from './Login';
import Register from './Register'; // ⬅️ Create this component
import ConfirmLogoutModal from './ConfirmLogoutModal'
import { database, ref, set, get, child} from './firebase'; // adjust path if needed


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [words, setWords] = useState([]);
  const [editingWord, setEditingWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  useEffect(() => {
    // Apply or remove the 'dark' class on <html> or <body>
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

   // Handle logout with confirmation
   const handleLogoutClick = () => {
    setIsModalOpen(true); // Open the confirmation modal
  };

  // Handle logout
  const handleConfirmLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setWords([]);
    setEditingWord(null);
    setSearchTerm('');
    setIsRegistering(false);
    setIsModalOpen(false); // Close the modal
    setDarkMode(false);
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false); // Close the modal without logging out
  };

  // Show login/register page if not logged in
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white px-4">
        <div className="w-full max-w-xl p-8">
          {isRegistering ? (
            <Register onRegister={handleLogin} toggleForm={() => setIsRegistering(false)} />
          ) : (
            <Login onLogin={handleLogin} toggleForm={() => setIsRegistering(true)} />
          )}
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 py-10 px-4 transition-all">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 border border-blue-100 dark:border-gray-700 transition-all">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-white text-center w-full">
            📘 French Vocab Word Bank
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-lg text-gray-700 dark:text-gray-300">
            👋 Hello, <strong>{username}</strong>
          </span>
          <div>
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Log out
            </button>

            {/* Confirmation Modal */}
            <ConfirmLogoutModal
              isOpen={isModalOpen}
              onConfirm={handleConfirmLogout}
              onCancel={handleCancelLogout}
            />
          </div>
        </div>

        <AddWordForm addWord={addWord} editingWord={editingWord} darkMode={darkMode}/>

        <div className="mt-6">
          <input
            type="text"
            placeholder="🔍 Search words..."
            className="border border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded p-2 w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <WordBank words={filteredWords} onEdit={startEditing} onDelete={deleteWord} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;

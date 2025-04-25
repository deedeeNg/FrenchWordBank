import React, { useState, useEffect } from 'react';
import AddWordForm from './AddWordForm';
import WordBank from './WordBank';
import Login from './Login';
import Register from './Register';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import { database, ref, set, get, child, update, onDisconnect } from './firebase';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [words, setWords] = useState([]);
  const [editingWord, setEditingWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  useEffect(() => {
    if (username && words.length > 0) {
      set(ref(database, `users/${username}/wordBank`), words);
    }
  }, [words, username]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const startEditing = (index) => {
    setEditingWord({ ...words[index], index });
  };

  const deleteWord = (indexToDelete) => {
    const userRef = ref(database, `users/${username}/wordBank`);
    const updatedWords = words.filter((_, index) => index !== indexToDelete);

    set(updatedWords.length > 0 ? userRef : ref(database, `users/${username}/wordBank`), updatedWords)
      .then(() => {
        setWords(updatedWords);
      })
      .catch((error) => {
        console.error('Error deleting word:', error);
      });
  };

  const filteredWords = words.filter((word) => {
    const term = searchTerm.toLowerCase();
    return (
      word.french.toLowerCase().startsWith(term) ||
      word.english.toLowerCase().startsWith(term)
    );
  });

  const handleLogin = async (enteredUsername, enteredPassword) => {
    if (!enteredUsername || !enteredPassword) {
      alert('Please enter valid username and password');
      return;
    }

    const userRef = ref(database, `users/${enteredUsername}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.loggedIn) {
        alert('🚫 This account is already in use.');
        return;
      }

      await update(userRef, {
        loggedIn: true,
        lastActive: Date.now()
      });

      onDisconnect(ref(database, `users/${enteredUsername}/loggedIn`)).set(false);

      setUsername(enteredUsername);
      setPassword(enteredPassword);
      setLoggedIn(true);
      setIsRegistering(false);
    } else {
      alert('Account does not exist. Please register.');
    }
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    await update(ref(database, `users/${username}`), { loggedIn: false });

    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setWords([]);
    setEditingWord(null);
    setSearchTerm('');
    setIsRegistering(false);
    setIsModalOpen(false);
    setDarkMode(false);
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

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

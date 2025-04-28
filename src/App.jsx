import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddWordForm from './AddWordForm';
import WordBank from './WordBank';
import Login from './Login';
import Register from './Register';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import Quiz from './Quiz';
import { database, ref, set, get, child, update, onDisconnect } from './firebase';
import { FiMenu, FiX } from 'react-icons/fi';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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

  const normalize = (str) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const filteredWords = words.filter((word) => {
    const term = normalize(searchTerm);
    return (
      normalize(word.french).startsWith(term) ||
      normalize(word.english).startsWith(term)
    );
  });

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
        lastActive: Date.now(),
      });

      onDisconnect(ref(database, `users/${enteredUsername}/loggedIn`)).set(false);

      setUsername(enteredUsername);
      setPassword(enteredPassword);
      setLoggedIn(true);
      setIsRegistering(false);
      setSidebarCollapsed(true); // Collapse sidebar after login
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
    setSidebarCollapsed(true);
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
    <Router>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-800 transition-all">
        {/* Sidebar */}
        <div
          className={`bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-6 flex flex-col transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } shadow-lg fixed top-0 left-0 h-full`}
        >
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mb-6 text-gray-800 dark:text-gray-300 focus:outline-none hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
          >
            {sidebarCollapsed ? (
              <FiMenu className="text-2xl" />
            ) : (
              <FiX className="text-2xl" />
            )}
          </button>

          {/* Navigation Bar */}
          <nav className="flex flex-col space-y-6">
            {!sidebarCollapsed && (
              <>
                <Link
                  to="/"
                  className="text-left hover:text-gray-500 dark:hover:text-gray-400 text-lg transition-all duration-300"
                >
                  🏠 Home
                </Link>
                <Link
                  to="/quiz"
                  className="text-left hover:text-gray-500 dark:hover:text-gray-400 text-lg transition-all duration-300"
                >
                  🧩 Quiz
                </Link>
              </>
            )}
          </nav>

          {/* Show Log out button only when sidebar is expanded */}
          {!sidebarCollapsed && (
            <div className="mt-auto">
              <button
                onClick={handleLogoutClick}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg text-white text-lg font-semibold mt-6 transition-all duration-300"
              >
                🚪 Log out
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 p-10 transition-all ${
            sidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                      📖 French Vocab Word Bank
                    </h1>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="ml-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-3 py-1 rounded"
                    >
                      {darkMode ? '🌞' : '🌙'}
                    </button>
                  </div>
                  <AddWordForm addWord={addWord} editingWord={editingWord} darkMode={darkMode} />
                  <div className="mt-6">
                    <input
                      type="text"
                      placeholder="🔍 Search words..."
                      className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded p-2 w-full mb-4"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <WordBank
                      words={filteredWords}
                      onEdit={startEditing}
                      onDelete={deleteWord}
                      darkMode={darkMode}
                    />
                  </div>
                </>
              }
            />
            <Route path="/quiz" element={<Quiz words={words} />} />
          </Routes>
        </div>

        {/* Confirm Logout Modal */}
        <ConfirmLogoutModal
          isOpen={isModalOpen}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      </div>
    </Router>
  );
}

export default App;

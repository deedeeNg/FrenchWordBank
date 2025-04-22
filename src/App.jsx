import React, { useState, useEffect } from 'react';
import AddWordForm from './AddWordForm';
import WordBank from './WordBank';

function App() {
  const [words, setWords] = useState(() => {
    const savedWords = localStorage.getItem('frenchWordBank');
    return savedWords ? JSON.parse(savedWords) : [];
  });

  const [editingWord, setEditingWord] = useState(null);

  useEffect(() => {
    localStorage.setItem('frenchWordBank', JSON.stringify(words));
  }, [words]);

  const addWord = (newWord) => {
    const isDuplicate = words.some((word) => word.french.toLowerCase() === newWord.french.toLowerCase());
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-blue-100">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          📘 French Vocab Word Bank
        </h1>
        <AddWordForm addWord={addWord} editingWord={editingWord} />
        <div className="mt-6">
          <WordBank words={words} onEdit={startEditing} />
        </div>
      </div>
    </div>
  );
}

export default App;

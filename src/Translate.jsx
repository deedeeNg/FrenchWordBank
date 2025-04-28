import React, { useState } from 'react';
import axios from 'axios';

const Translate = () => {
  const [inputText, setInputText] = useState('');
  const [translationDirection, setTranslationDirection] = useState('fr-en');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText('Please enter text to translate.');
      return;
    }

    setLoading(true);

    try {
      // Define source and target languages based on translation direction
      const [sourceLang, targetLang] = translationDirection === 'fr-en' ? ['fr', 'en'] : ['en', 'fr'];

      // Make API request to the Python backend
      const response = await axios.post('http://127.0.0.1:5000/translate', {
        text: inputText,
        source: sourceLang,
        target: targetLang,
      });

      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText('Error fetching translation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="p-6 max-w-2xl w-full bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">🌐 Translate</h1>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Enter text:</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            placeholder="Type here..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Translate direction:</label>
          <select
            value={translationDirection}
            onChange={(e) => setTranslationDirection(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="fr-en">French to English</option>
            <option value="en-fr">English to French</option>
          </select>
        </div>
        <button
          onClick={handleTranslate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          disabled={loading}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
        {translatedText && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Translation:</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translate;
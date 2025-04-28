import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Translate = () => {
  const [inputText, setInputText] = useState('');
  const [translationDirection, setTranslationDirection] = useState('fr-en');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async (text) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    setLoading(true);

    try {
      const [sourceLang, targetLang] = translationDirection === 'fr-en' ? ['fr', 'en'] : ['en', 'fr'];

      const response = await axios.post('http://127.0.0.1:8080/translate', {
        text,
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

  // Automatically translate when inputText changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleTranslate(inputText);
    }, 500); // Add a 500ms debounce to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [inputText, translationDirection]);

  // Function to speak the input text
  const handleSpeakInput = () => {
    if (!inputText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.lang = translationDirection === 'fr-en' ? 'fr-FR' : 'en-US'; // Set language based on direction
    window.speechSynthesis.speak(utterance);
  };

  // Function to speak the translated text
  const handleSpeakOutput = () => {
    if (!translatedText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = translationDirection === 'fr-en' ? 'en-US' : 'fr-FR'; // Set language based on direction
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">🌐 Translate</h1>
      <div className="w-full max-w-4xl bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Input Text Box */}
          <div className="relative flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none h-40"
              placeholder="Enter text here..."
            ></textarea>
            <button
              onClick={handleSpeakInput}
              className="absolute bottom-2 left-2 bg-transparent text-gray-800 dark:text-gray-100 p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-600"
              disabled={!inputText.trim()}
            >
              🔊
            </button>
          </div>

          {/* Output Text Box */}
          <div className="relative flex-1">
            <textarea
              value={translatedText}
              readOnly
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none h-40"
              placeholder="Translation will appear here..."
            ></textarea>
            <button
              onClick={handleSpeakOutput}
              className="absolute bottom-2 left-2 bg-transparent text-gray-800 dark:text-gray-100 p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-600"
              disabled={!translatedText.trim()}
            >
              🔊
            </button>
          </div>
        </div>

        {/* Translation Direction Selector */}
        <div className="flex items-center justify-between mt-4">
          <select
            value={translationDirection}
            onChange={(e) => setTranslationDirection(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="fr-en">French to English</option>
            <option value="en-fr">English to French</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Translate;
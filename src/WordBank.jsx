import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function WordBank({ words, onEdit, onDelete, darkMode }) {
  const speakWord = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  const reversedWords = [...words].reverse();

  return (
    <div className="space-y-4">
      <div>
        {reversedWords.map((word, index) => {
          const realIndex = words.length - 1 - index;
          return (
            <div
              key={realIndex}
              className={`border rounded p-4 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center transition-all transform hover:scale-105 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200'
              } mb-4`} // Added margin-bottom to create space between the cards
              style={{
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                willChange: 'box-shadow, background-color, transform',
                backfaceVisibility: 'hidden',
              }}
            >
              <div>
                <p className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  {word.french} ({word.type})
                  <button
                    onClick={() => speakWord(word.french)}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded"
                  >
                    🔈
                  </button>
                </p>
                <p className="text-gray-700 dark:text-gray-300">{word.english}</p>
                {word.sentence && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                    "{word.sentence}"
                  </p>
                )}
                {word.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Notes: {word.notes}
                  </p>
                )}
              </div>
              <div className="mt-2 md:mt-0 flex gap-2">
                <button
                  onClick={() => onEdit(realIndex)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(realIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WordBank;

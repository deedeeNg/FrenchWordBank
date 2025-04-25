import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function WordBank({ words, onEdit, onDelete, darkMode }) {
  let isFirstSpeech = true;
  const speakWord = (text) => {
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';

    if (isFirstSpeech) {
      isFirstSpeech = false;
      setTimeout(() => synth.speak(utterance), 100); // Helps trigger speech on first use
    } else {
      synth.speak(utterance);
    }
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
                  className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${word.french}"?`)) {
                      onDelete(realIndex);
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                  title="Delete"
                >
                  🗑️
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

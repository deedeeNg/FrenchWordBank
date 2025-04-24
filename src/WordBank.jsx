import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function WordBank({ words, onEdit, onDelete }) {
  const speakWord = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  const reversedWords = [...words].reverse();

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {reversedWords.map((word, index) => {
          const realIndex = words.length - 1 - index;
          return (
            <motion.div
              key={realIndex}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9fafb' // Light gray on hover
              }}
              className="border rounded p-4 bg-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center transition-all"
              style={{
                willChange: 'box-shadow, background-color',
                backfaceVisibility: 'hidden',
              }}
            >
              <div>
                <p className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                  {word.french} ({word.type})
                  <button
                    onClick={() => speakWord(word.french)}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded"
                  >
                    🔈
                  </button>
                </p>
                <p className="text-gray-700">{word.english}</p>
                {word.sentence && (
                  <p className="text-sm text-gray-500 italic mt-1">"{word.sentence}"</p>
                )}
                {word.notes && (
                  <p className="text-sm text-gray-600 mt-1">Notes: {word.notes}</p>
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
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default WordBank;

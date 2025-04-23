import React from 'react';

function WordBank({ words, onEdit, onDelete }) {
  // Function to pronounce the French word
  const speakWord = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      {words.map((word, index) => (
        <div
          key={index}
          className="border rounded p-4 bg-white shadow flex flex-col md:flex-row justify-between items-start md:items-center"
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
              onClick={() => onEdit(index)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WordBank;

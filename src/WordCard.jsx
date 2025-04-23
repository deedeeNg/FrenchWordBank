import React from 'react';

function WordCard({ word, index, onEdit }) {
  return (
    <div className="p-4 bg-blue-50 rounded-lg shadow-md border mb-4">
      {/* French word with custom font and margin */}
      <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">
        {word.french}
      </h1>

      <p><strong>Anglais:</strong> {word.english}</p>
      <p><strong>Type:</strong> {word.type}</p>
      {word.sentence && <p><strong>Example:</strong> {word.sentence}</p>}
      {word.notes && <p><strong>Notes:</strong> {word.notes}</p>}

      <button
        onClick={() => onEdit(index)}
        className="mt-3 inline-block text-sm text-blue-700 underline hover:text-blue-900"
      >
        ✏️ Edit
      </button>
    </div>
  );
}

export default WordCard;

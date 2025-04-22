import React from 'react';
import WordCard from './WordCard';

function WordBank({ words, onEdit }) {
  return (
    <div className="space-y-4">
      {words.map((word, index) => (
        <WordCard key={index} word={word} index={index} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default WordBank;

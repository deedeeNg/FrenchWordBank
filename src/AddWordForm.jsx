import React, { useState, useEffect } from 'react';

function AddWordForm({ addWord, editingWord }) {
  const [french, setFrench] = useState('');
  const [english, setEnglish] = useState('');
  const [gender, setGender] = useState('');
  const [sentence, setSentence] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingWord) {
      setFrench(editingWord.french);
      setEnglish(editingWord.english);
      setGender(
        editingWord.gender === 'm' ? 'masculine' :
        editingWord.gender === 'f' ? 'feminine' :
        editingWord.gender
      );
      setSentence(editingWord.sentence || '');
      setNotes(editingWord.notes || '');
    }
  }, [editingWord]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWord = { french, english, gender, sentence, notes };
    addWord(newWord);
    setFrench('');
    setEnglish('');
    setGender('');
    setSentence('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          className="border rounded p-2 w-full"
          placeholder="French word"
          value={french}
          onChange={(e) => setFrench(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          className="border rounded p-2 w-full"
          placeholder="English translation"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          required
        />
      </div>
      <div>
        <select
          className="border rounded p-2 w-full"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select gender</option>
          <option value="masculine">Masculine</option>
          <option value="feminine">Feminine</option>
        </select>
      </div>
      <div>
        <input
          className="border rounded p-2 w-full"
          placeholder="Example sentence (optional)"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
        />
      </div>
      <div>
        <input
          className="border rounded p-2 w-full"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
        {editingWord ? '✏️ Update Word' : '➕ Add Word'}
      </button>
    </form>
  );
}

export default AddWordForm;

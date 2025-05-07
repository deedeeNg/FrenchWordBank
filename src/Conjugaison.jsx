import React, { useState } from 'react';
const FrenchVerbs = require('french-verbs'); // CommonJS require
const Lefff = require('french-verbs-lefff/dist/conjugations.json'); // CommonJS require

const Conjugaison = () => {
  const [verb, setVerb] = useState('');
  const [presentTense, setPresentTense] = useState(null);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const normalizedVerb = verb.trim().toLowerCase(); // Normalize input
    try {
      // Check if the verb exists in the database
      if (!Lefff[normalizedVerb]) {
        setError(`The verb "${normalizedVerb}" is not found in the database.`);
        setPresentTense(null);
        return;
      }

      // Conjugate the verb in present tense for all pronouns
      const conjugations = {
        je: FrenchVerbs.getConjugation(Lefff, normalizedVerb, 'PRESENT', 0),
        tu: FrenchVerbs.getConjugation(Lefff, normalizedVerb, 'PRESENT', 1),
        il: FrenchVerbs.getConjugation(Lefff, normalizedVerb, 'PRESENT', 2),
        nous: FrenchVerbs.getConjugation(Lefff, normalizedVerb, 'PRESENT', 3),
        vous: FrenchVerbs.getConjugation(Lefff, normalizedVerb, 'PRESENT', 4),
        ils: FrenchVerbs.getConjugation(Lefff, normalizedVerb, 'PRESENT', 5),
      };

      setPresentTense(conjugations);
    } catch (err) {
      console.error('Error during conjugation:', err);
      setError('Unable to conjugate the verb. Please ensure it is valid.');
      setPresentTense(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6">Conjugaison Page</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
          placeholder="Enter a verb (e.g., parler, finir, vendre)"
          className="border border-gray-300 rounded-lg p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Conjugate
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {presentTense && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Present Tense Conjugation</h2>
          <p><strong>je:</strong> {presentTense.je}</p>
          <p><strong>tu:</strong> {presentTense.tu}</p>
          <p><strong>il/elle:</strong> {presentTense.il}</p>
          <p><strong>nous:</strong> {presentTense.nous}</p>
          <p><strong>vous:</strong> {presentTense.vous}</p>
          <p><strong>ils/elles:</strong> {presentTense.ils}</p>
        </div>
      )}
    </div>
  );
};

export default Conjugaison;
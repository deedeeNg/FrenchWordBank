import React, { useState, useEffect } from 'react';

function Quiz({ words }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Timer set to 1 minute
  const [quizEnded, setQuizEnded] = useState(false);
  const [feedback, setFeedback] = useState(''); // New state for feedback message

  useEffect(() => {
    if (quizStarted && words.length > 0) {
      generateQuestion();
    }
  }, [words, questionIndex, quizStarted]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the timer
    } else if (timeLeft === 0) {
      setQuizEnded(true); // End the quiz when the timer reaches 0
    }
  }, [timeLeft, quizStarted]);

  const generateQuestion = () => {
    // Select a random word as the correct answer
    const correctWord = words[Math.floor(Math.random() * words.length)];

    // Select three random incorrect answers
    const incorrectWords = words
      .filter((word) => word.french !== correctWord.french)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Combine correct and incorrect answers, then shuffle
    const allOptions = [...incorrectWords, correctWord].sort(() => 0.5 - Math.random());

    setCurrentQuestion(correctWord);
    setOptions(allOptions);
  };

  const handleAnswer = (selectedWord) => {
    if (quizEnded) return; // Prevent answering after the quiz ends

    if (selectedWord.french === currentQuestion.french) {
      setScore(score + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect! The correct answer was "${currentQuestion.french}".`);
    }

    setQuestionIndex(questionIndex + 1);
    generateQuestion(); // Generate a new question regardless of correctness
  };

  const restartQuiz = () => {
    // Reset all relevant state variables to start a new game
    setQuizStarted(false);
    setCurrentQuestion(null);
    setOptions([]);
    setScore(0);
    setQuestionIndex(0);
    setTimeLeft(60); // Reset timer to 1 minute
    setQuizEnded(false);
    setFeedback('');
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="p-6 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-6">Are you ready?</h1>
          <button
            onClick={() => setQuizStarted(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div>Loading...</div>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="p-6 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Quiz Ended</h1>
          <p className="text-lg mb-6">Your final score: {score}</p>
          <button
            onClick={restartQuiz}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Quiz</h1>
        <p className="text-lg mb-2">Score: {score}</p>
        <p className="text-lg mb-2">Time Left: {timeLeft}s</p>
        <p className="text-lg mb-6 text-green-600 dark:text-green-400">{feedback}</p>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            What is the French word for "{currentQuestion.english}"?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
              >
                {option.french}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
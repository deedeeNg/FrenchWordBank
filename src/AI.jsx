import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai'; // Import the GoogleGenAI library

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBBjnn3RxJhbTA5fo7ZRW5qOqynrFAequI' }); // Replace with your API key

const AI = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Store chat messages
  const [loading, setLoading] = useState(false);

  // Load chat history from localStorage when the component mounts
  useEffect(() => {
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    // Save only plain text data to avoid circular references
    const plainChatHistory = chatHistory.map((message) => ({
      sender: message.sender,
      text: typeof message.text === 'string' ? message.text : '', // Ensure text is a string
    }));
    localStorage.setItem('chatHistory', JSON.stringify(plainChatHistory));
  }, [chatHistory]);

  const handleAskAI = async () => {
    if (!userInput.trim()) {
      return;
    }

    // Add user input to chat history
    setChatHistory((prev) => [...prev, { sender: 'user', text: userInput }]);
    setUserInput('');
    setLoading(true);

    try {
      // Prepare the context by combining the chat history
      const context = chatHistory
        .map((message) => `${message.sender === 'user' ? 'User' : 'AI'}: ${message.text}`)
        .join('\n');

      // Include the context and the new user input in the API request
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${context}\nUser: ${userInput}\nAI:`,
      });

      // Add AI response to chat history
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: response.text || 'No response received from the AI.' },
      ]);
    } catch (error) {
      console.error('Error communicating with Gemini API:', error);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the AI's response into structured HTML
  const formatResponse = (text) => {
    const lines = text.split('\n').map(line => line.trim());
    const elements = [];
    let currentList = null;
    let isOrdered = false;
  
    const renderWithFormatting = (text, indexPrefix = '') => {
      const parts = text.split(/(\*\*.*?\*\*)/); // Split by bold
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${indexPrefix}-strong-${i}`}>{part.replace(/\*\*/g, '').trim()}</strong>;
        } else {
          return part;
        }
      });
    };
  
    lines.forEach((line, index) => {
      if (!line) {
        // Skip empty lines
        return;
      }
  
      if (line.startsWith('**')) {
        // Close any open list first
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(
          <h3 key={`heading-${index}`} className="font-bold text-lg mt-4">
            {line.replace(/\*\*/g, '').trim()}
          </h3>
        );
      } else if (line.startsWith('*')) {
        // Start unordered list if needed
        if (!currentList || isOrdered) {
          if (currentList) elements.push(currentList);
          currentList = <ul key={`ul-${index}`} className="list-disc ml-6">{[]}</ul>;
          isOrdered = false;
        }
        currentList = React.cloneElement(currentList, {
          children: [...currentList.props.children, 
            <li key={`li-${index}`} className="mt-1">
              {renderWithFormatting(line.replace('*', '').trim(), `li-${index}`)}
            </li>
          ]
        });
      } else if (line.match(/^\d+\./)) {
        // Start ordered list if needed
        if (!currentList || !isOrdered) {
          if (currentList) elements.push(currentList);
          currentList = <ol key={`ol-${index}`} className="list-decimal ml-6">{[]}</ol>;
          isOrdered = true;
        }
        currentList = React.cloneElement(currentList, {
          children: [...currentList.props.children, 
            <li key={`li-${index}`} className="mt-1">
              {renderWithFormatting(line.replace(/^\d+\./, '').trim(), `li-${index}`)}
            </li>
          ]
        });
      } else {
        // Close any open list first
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        // Paragraph with bold inside
        elements.push(
          <p key={`p-${index}`} className="mt-2">
            {renderWithFormatting(line, `p-${index}`)}
          </p>
        );
      }
    });
  
    // Push any leftover list
    if (currentList) {
      elements.push(currentList);
    }
  
    return elements;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent a new line from being added
      handleAskAI(); // Trigger the send message function
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        🤖 AI French Tutor (Gemini API)
      </h1>
      <div className="w-full max-w-3xl bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col">
        {/* Chatbox */}
        <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                }`}
                style={{ maxWidth: '75%' }}
              >
                {message.sender === 'ai' ? (
                  <div>{formatResponse(message.text)}</div>
                ) : (
                  message.text
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown} // Add the onKeyDown event listener
            className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none h-16"
            placeholder="Type your message..."
          ></textarea>
          <button
            onClick={handleAskAI}
            className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AI;
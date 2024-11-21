import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Plus, Globe, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: inputText }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.choices[0].message.content, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInputText('');
    resetTranscript();
  };

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Supremo</h1>
        </div>
        <div className="flex items-center space-x-4">
          <MessageCircle className="w-6 h-6" />
          <button className="p-2">
            <span className="sr-only">Menu</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4 p-4 overflow-x-auto">
        <button className="px-4 py-2 bg-gray-800 rounded-full text-sm whitespace-nowrap">
          /coding_job
        </button>
        <button className="px-4 py-2 bg-gray-800 rounded-full text-sm whitespace-nowrap">
          /deploy_code
        </button>
        <button className="px-4 py-2 bg-gray-800 rounded-full text-sm whitespace-nowrap">
          /web_search
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-lg ${
                message.isUser ? 'bg-blue-600' : 'bg-gray-800'
              }`}>
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <Plus className="w-6 h-6" />
          <Globe className="w-6 h-6" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message"
            className="flex-1 bg-transparent focus:outline-none"
          />
          <button
            onClick={toggleListening}
            className={`p-2 rounded-full ${isListening ? 'bg-red-600' : 'bg-gray-800'}`}
          >
            <Mic className="w-6 h-6" />
          </button>
          {isListening && (
            <button
              onClick={() => {
                setIsListening(false);
                SpeechRecognition.stopListening();
              }}
              className="p-2 rounded-full bg-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
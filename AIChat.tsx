import React, { useState, useRef, useEffect } from 'react';
import { getAIChatResponse } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! I am your CampusEats Assistant. Hungry? Confused? Just ask!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await getAIChatResponse([], userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[70vh]">
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-4 text-white flex items-center">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
          <i className="fas fa-headset text-xl"></i>
        </div>
        <div>
          <h2 className="font-bold text-lg">CampusEats Smart Assistant</h2>
          <p className="text-xs opacity-80">Online Support</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
              m.role === 'user' 
                ? 'bg-rose-500 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none animate-pulse flex space-x-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center space-x-3">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="What should I eat for a rainy day?"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors disabled:opacity-50"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default AIChat;

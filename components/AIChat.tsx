
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Bot, Database, ArrowRight } from 'lucide-react';
import { SHIRONEKO_DOCUMENT } from '../knowledge';
import { SITE_ASSETS } from '../constants';

const SUGGESTIONS = [
  "When is SHIRONEKO free for a dinner?",
  "Tell me more about SHIRONEKO",
  "How to contact SHIRONEKO?",
  "Tell me a cat joke!"
];

interface AIChatProps {
  transparent?: boolean;
}

const AIChat: React.FC<AIChatProps> = ({ transparent = false }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize - Check API Key
  useEffect(() => {
    if (process.env.API_KEY) {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    if (!isInitialized) {
       setMessages(prev => [...prev, { role: 'user', text: messageText }, { role: 'model', text: "Still waking up (Checking API Key)... Please try again in a second! ^^" }]);
       return;
    }

    const userMessage = messageText.trim();
    setInput('');
    
    // Optimistic update
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare messages for DeepSeek API
      const apiMessages = [
        { role: "system", content: SHIRONEKO_DOCUMENT },
        ...newMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${'YOUR_API_KEY HERE'}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: apiMessages,
          stream: false,
          temperature: 1.3
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "Meow? I couldn't quite hear that...";
      
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, my whiskers are tingling. Something went wrong with the connection. Meow!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = transparent
    ? "w-full h-full flex flex-col rounded-2xl p-3 border border-gray-100 dark:border-slate-700/50 bg-white/20 dark:bg-slate-700/20 relative overflow-hidden"
    : "w-full h-full flex flex-col bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-4 shadow-sm border border-blue-100 dark:border-slate-700 relative overflow-hidden";

  const containerStyle = SITE_ASSETS.chatBackground
    ? { backgroundImage: `url(${SITE_ASSETS.chatBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  // Helper function to render markdown formatting (bold, etc)
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 border-b border-blue-50 dark:border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
            <Bot size={16} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xs sm:text-sm">Chat with KURONEKO</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`relative flex h-1.5 w-1.5 ${isInitialized ? '' : 'opacity-50'}`}>
                {isInitialized && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isInitialized ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              </span>
              <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-widest font-medium">
                {isInitialized ? 'Powered by DeepSeek' : 'Connecting...'}
              </p>
            </div>
          </div>
        </div>
        <div className="p-1.5 text-blue-300 dark:text-blue-700" title="Knowledge Base Connected">
          <Database size={14} />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="h-[300px] overflow-y-auto space-y-1.5 mb-3 pr-2 hide-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-2">
            <div className="text-center space-y-2 mb-6 opacity-60">
                <Sparkles className="text-blue-400 mx-auto" size={24} />
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[200px] mx-auto">
                Meow! I know SHIRONEKO well! <br/>
                Ask me anything!
                </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 w-full max-w-[240px]">
                {SUGGESTIONS.map((suggestion, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="text-xs text-left px-3 py-2 bg-white dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl border border-blue-50 dark:border-slate-600 text-gray-600 dark:text-gray-300 transition-all hover:scale-105 active:scale-95 flex items-center justify-between group"
                    >
                        <span>{suggestion}</span>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                    </button>
                ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-2.5 py-1.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user' 
                ? 'bg-blue-500 text-white rounded-tr-none shadow-md shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-slate-600 rounded-tl-none'
              }`}
            >
              {renderMarkdown(msg.text)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-700 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-slate-600">
              <Loader2 size={14} className="animate-spin text-blue-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative mt-auto">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask KURONEKO..."
          className="w-full bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl pl-4 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all dark:text-white shadow-sm"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-all shadow-sm active:scale-95"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
    

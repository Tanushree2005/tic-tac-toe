
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowDown } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  className?: string;
  onlinePlayerName?: string;
}

const Chat: React.FC<ChatProps> = ({ className, onlinePlayerName = 'Opponent' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'system',
      content: 'Welcome to the chat!',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Check if scroll position is not at bottom
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isAtBottom);
    }
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const yourMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'you',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, yourMessage]);
    setNewMessage('');
    
    // Simulate receiving a response
    setTimeout(() => {
      const simulatedResponses = [
        "Good move!",
        "I see what you're doing there.",
        "Hmm, interesting strategy.",
        "Let me think about my next move...",
        "You're pretty good at this game!",
        "I didn't see that coming.",
        "Nice try!",
        "I'm going to win this round.",
        "Let's play again after this.",
        "This is fun!"
      ];
      
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'opponent',
        content: simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000 + Math.random() * 2000);
  };
  
  return (
    <div className={`flex flex-col h-full bg-white/70 dark:bg-gray-900/40 backdrop-blur-md shadow-md rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Chat with {onlinePlayerName}</h3>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        onScroll={handleScroll}
      >
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'system' ? (
              <div className="text-center w-full text-sm py-1 px-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                {message.content}
              </div>
            ) : (
              <div className={`chat-bubble ${message.sender === 'you' ? 'chat-bubble-sender' : 'chat-bubble-receiver'}`}>
                <div className="text-sm text-gray-800 dark:text-gray-200">{message.content}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-16 right-6 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
        >
          <ArrowDown size={16} />
        </button>
      )}
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 backdrop-blur-md flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/80 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md transition-colors"
          disabled={newMessage.trim() === ''}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;

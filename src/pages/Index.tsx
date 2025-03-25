import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutGrid, User, Bot, ChevronRight } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import Modal from '../components/Modal';

const Index = () => {
  const { startNewGame } = useGame();
  const navigate = useNavigate();
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [playerXName, setPlayerXName] = useState('Player X');
  const [playerOName, setPlayerOName] = useState('Player O');
  
  const handleStartOfflineGame = (e: React.FormEvent) => {
    e.preventDefault();
    startNewGame('offline', playerXName, playerOName);
    setShowOfflineModal(false);
    navigate('/game');
  };
  
  const handleStartAIGame = (e: React.FormEvent) => {
    e.preventDefault();
    startNewGame('ai', playerXName, 'AI');
    setShowAIModal(false);
    navigate('/game');
  };
  
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6 animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                Tic-Tac-Toe
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Play the classic game of Tic-Tac-Toe offline with friends, 
              against AI, or challenge opponents online.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {/* Card 1: Local game */}
            <div className="glass-panel rounded-xl overflow-hidden animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <User size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Local Multiplayer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Play with a friend on the same device. Take turns making moves and see who wins!
                </p>
                <button
                  onClick={() => setShowOfflineModal(true)}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <span>Play with a Friend</span>
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
            
            {/* Card 2: AI game */}
            <div className="glass-panel rounded-xl overflow-hidden animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <Bot size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Play Against AI</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Challenge our AI opponent. Test your skills and see if you can outsmart it!
                </p>
                <button
                  onClick={() => setShowAIModal(true)}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <span>Play Against AI</span>
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
            
            {/* Card 3: Online game */}
            <div className="glass-panel rounded-xl overflow-hidden animate-slide-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                  <LayoutGrid size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Online Multiplayer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Play with people around the world. Chat with your opponent while you play!
                </p>
                <Link to="/online" className="btn-primary w-full flex items-center justify-center">
                  <span>Play Online</span>
                  <ChevronRight size={18} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-16 glass-panel px-8 py-6 rounded-xl max-w-5xl w-full animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Choose a Mode</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select from offline, AI, or online multiplayer modes.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Make Your Move</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click on an empty cell to place your marker (X or O).
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Win the Game</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get three of your markers in a row (horizontal, vertical, or diagonal).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Offline game modal */}
      <Modal 
        isOpen={showOfflineModal} 
        onClose={() => setShowOfflineModal(false)} 
        title="Start Local Game"
      >
        <form onSubmit={handleStartOfflineGame}>
          <div className="space-y-4">
            <div>
              <label htmlFor="playerX" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Player X Name
              </label>
              <input
                type="text"
                id="playerX"
                value={playerXName}
                onChange={(e) => setPlayerXName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800"
                maxLength={15}
                required
              />
            </div>
            
            <div>
              <label htmlFor="playerO" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Player O Name
              </label>
              <input
                type="text"
                id="playerO"
                value={playerOName}
                onChange={(e) => setPlayerOName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800"
                maxLength={15}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowOfflineModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Start Game
              </button>
            </div>
          </div>
        </form>
      </Modal>
      
      {/* AI game modal */}
      <Modal 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)} 
        title="Play Against AI"
      >
        <form onSubmit={handleStartAIGame}>
          <div className="space-y-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerXName}
                onChange={(e) => setPlayerXName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800"
                maxLength={15}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAIModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Start Game
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Index;

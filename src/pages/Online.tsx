
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import GameBoard from '../components/GameBoard';
import PlayerInfo from '../components/PlayerInfo';
import Chat from '../components/Chat';
import Modal from '../components/Modal';
import { RotateCcw, Home, Copy, Check, RefreshCw } from 'lucide-react';

const Online = () => {
  const { 
    gameMode, 
    gameStatus, 
    winner, 
    resetGame, 
    currentPlayer, 
    players,
    startNewGame
  } = useGame();
  
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showWaitingModal, setShowWaitingModal] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [connectCode, setConnectCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();
  
  // Generate a game code on mount
  useEffect(() => {
    // Simple code generation for demo
    const generateCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    setGameCode(generateCode());
  }, []);
  
  // Show game over modal when game is finished
  useEffect(() => {
    if ((gameStatus === 'finished' || gameStatus === 'draw') && gameMode === 'online') {
      setTimeout(() => {
        setShowGameOverModal(true);
      }, 1000);
    }
  }, [gameStatus, gameMode]);
  
  const handlePlayAgain = () => {
    setShowGameOverModal(false);
    resetGame();
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleStartOnlineGame = (e: React.FormEvent) => {
    e.preventDefault();
    startNewGame('online', playerName);
    setShowWaitingModal(false);
  };
  
  const handleConnectToGame = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      startNewGame('online', playerName);
      setShowWaitingModal(false);
    }, 1500);
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Online Multiplayer</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Play with a friend and chat while you play
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-slide-up">
          <div className="lg:col-span-1 flex flex-col space-y-5">
            <div className="md:flex lg:block space-x-4 md:space-x-4 lg:space-x-0 lg:space-y-4">
              <PlayerInfo player="X" className="mb-4 md:mb-0 lg:mb-4 h-32 flex-1 lg:flex-none" />
              <PlayerInfo player="O" className="h-32 flex-1 lg:flex-none" />
            </div>
            
            <div className="glass-panel rounded-xl p-4">
              <div className="text-center mb-4">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium 
                  ${currentPlayer === 'X' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300'}`}>
                  Game in progress
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={resetGame}
                  className="btn-secondary w-full flex items-center justify-center"
                  disabled={gameStatus === 'waiting'}
                >
                  <RotateCcw size={18} className="mr-2" />
                  <span>Reset Game</span>
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="btn-secondary w-full flex items-center justify-center"
                >
                  <Home size={18} className="mr-2" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex items-center justify-center">
            <GameBoard className="w-full max-w-md mx-auto" />
          </div>
          
          <div className="lg:col-span-2 h-[500px]">
            <Chat onlinePlayerName={players.O.name} className="h-full" />
          </div>
        </div>
        
        <div className="mt-8 text-center animate-fade-in">
          <div className="glass-panel inline-block px-6 py-3 rounded-lg">
            {gameStatus === 'playing' && (
              <p className="text-lg font-medium">
                Current turn: <span className={currentPlayer === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}>
                  {players[currentPlayer].name} ({currentPlayer})
                </span>
              </p>
            )}
            
            {gameStatus === 'finished' && winner && (
              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                {players[winner].name} wins!
              </p>
            )}
            
            {gameStatus === 'draw' && (
              <p className="text-lg font-medium text-amber-600 dark:text-amber-400">
                Game ended in a draw!
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Game over modal */}
      <Modal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        title={winner ? "Game Over" : "It's a Draw!"}
      >
        <div className="text-center pb-4">
          {winner ? (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {players[winner].name} Wins!
            </h3>
          ) : (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              It's a Draw!
            </h3>
          )}
          
          <div className="flex space-x-4 justify-center mt-6">
            <button onClick={handlePlayAgain} className="btn-primary">
              Play Again
            </button>
            <button onClick={handleGoHome} className="btn-secondary">
              Return Home
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Waiting/Connection modal */}
      <Modal
        isOpen={showWaitingModal}
        onClose={() => navigate('/')}
        title="Online Game Setup"
        showCloseButton={false}
      >
        <div className="space-y-6">
          <form onSubmit={handleStartOnlineGame}>
            <div className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800"
                  placeholder="Enter your name"
                  maxLength={15}
                  required
                />
              </div>
            </div>
          </form>
          
          <div className="border-t border-b border-gray-200 dark:border-gray-800 py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Create a new game
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50 font-mono text-gray-800 dark:text-gray-200">
                  {gameCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Copy game code"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Share this code with your friend to join your game
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Or join an existing game
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={connectCode}
                  onChange={(e) => setConnectCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 font-mono"
                  placeholder="Enter game code"
                  maxLength={6}
                />
                <button
                  onClick={handleConnectToGame}
                  disabled={!connectCode || connectCode.length < 6 || isConnecting || !playerName}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-blue-500"
                  title="Connect to game"
                >
                  {isConnecting ? <RefreshCw size={20} className="animate-spin" /> : <Check size={20} />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleStartOnlineGame}
              disabled={!playerName}
              className="btn-primary"
            >
              Start Game
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Online;

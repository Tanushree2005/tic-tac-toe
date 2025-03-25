
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import GameBoard from '../components/GameBoard';
import PlayerInfo from '../components/PlayerInfo';
import Modal from '../components/Modal';
import { RotateCcw, Home, Trophy } from 'lucide-react';

const Game = () => {
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
  const navigate = useNavigate();
  
  // Show game over modal when game is finished
  useEffect(() => {
    if (gameStatus === 'finished' || gameStatus === 'draw') {
      setTimeout(() => {
        setShowGameOverModal(true);
      }, 1000);
    }
  }, [gameStatus]);
  
  // Redirect to home if game mode is not set
  useEffect(() => {
    if (gameStatus === 'waiting') {
      navigate('/');
    }
  }, [gameStatus, navigate]);

  // Start a new game if none is in progress
  useEffect(() => {
    if (gameStatus === 'waiting') {
      startNewGame('offline');
    }
  }, [gameStatus, startNewGame]);
  
  const handlePlayAgain = () => {
    setShowGameOverModal(false);
    resetGame();
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const getGameTitle = () => {
    if (gameMode === 'offline') return 'Local Multiplayer';
    if (gameMode === 'ai') return 'Playing Against AI';
    return 'Game';
  };
  
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getGameTitle()}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {gameMode === 'offline' 
              ? "Take turns with your friend on the same device" 
              : "Try to beat the AI!"}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row animate-slide-up">
          <div className="md:w-1/4 mb-6 md:mb-0 md:pr-6 flex flex-col">
            <div className="mb-8">
              <PlayerInfo player="X" className="mb-4 h-32" />
              <PlayerInfo player="O" className="h-32" />
            </div>
            
            <div className="space-y-3 mt-auto">
              <button
                onClick={resetGame}
                className="btn-secondary w-full flex items-center justify-center"
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
          
          <div className="md:w-3/4 glass-panel rounded-xl p-6 flex items-center justify-center">
            <GameBoard className="w-full max-w-md mx-auto" />
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
        showCloseButton={false}
      >
        <div className="text-center pb-4">
          {winner ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {players[winner].name} Wins!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Congratulations on your victory!
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-4">
                <span className="text-xl font-bold">=</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                It's a Draw!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Well played by both sides.
              </p>
            </>
          )}
          
          <div className="flex space-x-4 justify-center">
            <button onClick={handlePlayAgain} className="btn-primary">
              Play Again
            </button>
            <button onClick={handleGoHome} className="btn-secondary">
              Return Home
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Game;

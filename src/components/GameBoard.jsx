
import React, { useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';

const GameBoard = ({ className }) => {
  const { 
    board, 
    currentPlayer, 
    winner, 
    makeMove, 
    winningCombination,
    gameStatus
  } = useGame();
  
  const boardRef = useRef(null);
  
  // Function to render X
  const renderX = (index) => {
    return (
      <div className={`marker-x ${board[index] === 'X' ? 'active' : ''}`}>
        <svg 
          className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 x-svg ${board[index] === 'X' ? 'animate' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6L18 18" />
        </svg>
      </div>
    );
  };
  
  // Function to render O
  const renderO = (index) => {
    return (
      <div className={`marker-o ${board[index] === 'O' ? 'active' : ''}`}>
        <svg 
          className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 o-svg ${board[index] === 'O' ? 'animate' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="8" />
        </svg>
      </div>
    );
  };

  // Apply winning animation
  useEffect(() => {
    if (winningCombination && boardRef.current) {
      const cells = boardRef.current.querySelectorAll('.game-cell');
      winningCombination.forEach(index => {
        cells[index].classList.add('scale-105', 'shadow-md', 'ring-2', 'ring-blue-500', 'dark:ring-blue-400');
      });
      
      // Pulse animation for the winning combination
      const interval = setInterval(() => {
        winningCombination.forEach(index => {
          cells[index].classList.toggle('opacity-90');
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [winningCombination]);
  
  return (
    <div 
      ref={boardRef}
      className={`grid grid-cols-3 gap-2 md:gap-3 ${className}`}
      style={{ 
        width: '100%', 
        maxWidth: '400px', 
        margin: '0 auto',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: '8px',
        borderRadius: '12px'
      }}
    >
      {board.map((cell, index) => (
        <div
          key={index}
          className={`game-cell w-full aspect-square flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm 
          hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer relative
          ${gameStatus !== 'playing' || cell !== null ? 'pointer-events-none' : ''}
          ${winningCombination?.includes(index) ? 'winning-cell border-blue-400 dark:border-blue-500' : ''}`}
          onClick={() => makeMove(index)}
        >
          {renderX(index)}
          {renderO(index)}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;

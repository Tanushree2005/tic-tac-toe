
import React, { useEffect, useRef } from 'react';
import { useGame, Player } from '../contexts/GameContext';

interface GameBoardProps {
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ className }) => {
  const { 
    board, 
    currentPlayer, 
    winner, 
    makeMove, 
    winningCombination,
    gameStatus
  } = useGame();
  
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Function to render X
  const renderX = (index: number) => {
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
  const renderO = (index: number) => {
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
      className={`grid grid-cols-3 gap-2 md:gap-3 aspect-square ${className}`}
    >
      {board.map((cell, index) => (
        <div
          key={index}
          className={`game-cell ${
            gameStatus !== 'playing' || cell !== null ? 'game-cell-disabled' : ''
          } ${
            winningCombination?.includes(index) 
              ? 'winning-cell border-blue-300 dark:border-blue-500' 
              : ''
          }`}
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


import React from 'react';
import { useGame, Player } from '../contexts/GameContext';

interface PlayerInfoProps {
  player: Player;
  className?: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, className }) => {
  const { currentPlayer, players, winner, gameStatus } = useGame();
  
  const isCurrentPlayer = currentPlayer === player && gameStatus === 'playing';
  const isWinner = winner === player;
  
  return (
    <div 
      className={`rounded-lg ${className} ${
        isCurrentPlayer 
          ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'bg-white/50 dark:bg-gray-800/30'
      } ${
        isWinner ? 'ring-2 ring-green-400 dark:ring-green-600 bg-green-50 dark:bg-green-900/20' : ''
      } backdrop-blur-sm px-4 py-3 flex flex-col items-center justify-center transition-all duration-300`}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          player === 'X' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 
          'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400'
        }`}>
          <span className="font-bold">{player}</span>
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {players[player].name}
        </span>
      </div>
      
      <div className="mt-2 font-semibold text-2xl">
        {players[player].score}
      </div>
      
      {isCurrentPlayer && (
        <div className="mt-2 w-full">
          <div className="h-1 w-full bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 dark:bg-blue-600 animate-pulse-subtle" style={{ width: '100%' }}></div>
          </div>
        </div>
      )}
      
      {isWinner && (
        <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
          Winner!
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;

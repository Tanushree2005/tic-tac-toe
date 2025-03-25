
import React, { createContext, useContext, useState, useEffect } from 'react';

// Game types
export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];
export type GameMode = 'offline' | 'online' | 'ai';
export type GameStatus = 'waiting' | 'playing' | 'finished' | 'draw';

// Player types
type PlayerType = 'human' | 'ai' | 'remote';
interface PlayerInfo {
  name: string;
  type: PlayerType;
  score: number;
}

interface GameContextType {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameMode: GameMode;
  gameStatus: GameStatus;
  players: {
    X: PlayerInfo;
    O: PlayerInfo;
  };
  winningCombination: number[] | null;
  makeMove: (index: number) => void;
  resetGame: () => void;
  startNewGame: (mode: GameMode, playerXName?: string, playerOName?: string) => void;
  setPlayerName: (player: Player, name: string) => void;
  setPlayerType: (player: Player, type: PlayerType) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialBoard: Board = Array(9).fill(null);
  
  const [board, setBoard] = useState<Board>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('offline');
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [winningCombination, setWinningCombination] = useState<number[] | null>(null);
  
  const [players, setPlayers] = useState<{
    X: PlayerInfo;
    O: PlayerInfo;
  }>({
    X: { name: 'Player X', type: 'human', score: 0 },
    O: { name: 'Player O', type: 'human', score: 0 }
  });

  // Winning combinations: rows, columns, diagonals
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Check for a win or draw
  const checkGameStatus = (currentBoard: Board) => {
    // Check for win
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        const winningPlayer = currentBoard[a] as Player;
        setWinner(winningPlayer);
        setWinningCombination(winningLines[i]);
        setGameStatus('finished');
        
        // Update score
        setPlayers(prev => ({
          ...prev,
          [winningPlayer]: {
            ...prev[winningPlayer],
            score: prev[winningPlayer].score + 1
          }
        }));
        
        return;
      }
    }

    // Check for draw
    if (!currentBoard.includes(null)) {
      setWinner('draw');
      setGameStatus('draw');
      return;
    }
  };

  // Handle player move
  const makeMove = (index: number) => {
    if (board[index] !== null || winner !== null || gameStatus !== 'playing') {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    // Check game status after move
    checkGameStatus(newBoard);
    
    // Switch player
    setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
  };

  // Reset game to play again
  const resetGame = () => {
    setBoard(initialBoard);
    setWinner(null);
    setWinningCombination(null);
    setCurrentPlayer('X');
    setGameStatus('playing');
  };

  // Start a new game with mode
  const startNewGame = (mode: GameMode, playerXName?: string, playerOName?: string) => {
    setGameMode(mode);
    setBoard(initialBoard);
    setWinner(null);
    setWinningCombination(null);
    setCurrentPlayer('X');
    setGameStatus('playing');
    
    // Update player info based on mode
    if (mode === 'ai') {
      setPlayers({
        X: { 
          name: playerXName || 'You', 
          type: 'human', 
          score: players.X.score 
        },
        O: { 
          name: playerOName || 'AI', 
          type: 'ai', 
          score: players.O.score 
        }
      });
    } else if (mode === 'offline') {
      setPlayers({
        X: { 
          name: playerXName || 'Player X', 
          type: 'human', 
          score: players.X.score 
        },
        O: { 
          name: playerOName || 'Player O', 
          type: 'human', 
          score: players.O.score 
        }
      });
    } else if (mode === 'online') {
      setPlayers({
        X: { 
          name: playerXName || 'You', 
          type: 'human', 
          score: players.X.score 
        },
        O: { 
          name: playerOName || 'Opponent', 
          type: 'remote', 
          score: players.O.score 
        }
      });
    }
  };

  // Update player name
  const setPlayerName = (player: Player, name: string) => {
    setPlayers(prev => ({
      ...prev,
      [player]: {
        ...prev[player],
        name
      }
    }));
  };

  // Update player type
  const setPlayerType = (player: Player, type: PlayerType) => {
    setPlayers(prev => ({
      ...prev,
      [player]: {
        ...prev[player],
        type
      }
    }));
  };
  
  // AI turn logic
  useEffect(() => {
    // If it's AI's turn
    if (
      gameStatus === 'playing' &&
      currentPlayer === 'O' &&
      players.O.type === 'ai' &&
      !winner
    ) {
      const timer = setTimeout(() => {
        // Make a smart move
        makeAIMove();
      }, 700); // Delay for a more natural feel
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameStatus, players.O.type, winner]);

  // Simple AI logic for making a move
  const makeAIMove = () => {
    // If board is full or game is won, don't make a move
    if (winner || !board.includes(null)) return;
    
    // Try to win
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (board[a] === 'O' && board[b] === 'O' && board[c] === null) {
        makeMove(c);
        return;
      }
      if (board[a] === 'O' && board[c] === 'O' && board[b] === null) {
        makeMove(b);
        return;
      }
      if (board[b] === 'O' && board[c] === 'O' && board[a] === null) {
        makeMove(a);
        return;
      }
    }
    
    // Block opponent from winning
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (board[a] === 'X' && board[b] === 'X' && board[c] === null) {
        makeMove(c);
        return;
      }
      if (board[a] === 'X' && board[c] === 'X' && board[b] === null) {
        makeMove(b);
        return;
      }
      if (board[b] === 'X' && board[c] === 'X' && board[a] === null) {
        makeMove(a);
        return;
      }
    }
    
    // Take center if available
    if (board[4] === null) {
      makeMove(4);
      return;
    }
    
    // Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === null);
    if (availableCorners.length > 0) {
      const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
      makeMove(randomCorner);
      return;
    }
    
    // Take any available space
    const availableSpaces = board.map((cell, i) => cell === null ? i : null).filter(i => i !== null) as number[];
    if (availableSpaces.length > 0) {
      const randomSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
      makeMove(randomSpace);
    }
  };
  
  return (
    <GameContext.Provider
      value={{
        board,
        currentPlayer,
        winner,
        gameMode,
        gameStatus,
        players,
        winningCombination,
        makeMove,
        resetGame,
        startNewGame,
        setPlayerName,
        setPlayerType
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

import { create } from "zustand";

// Define the Player and GameState types
export interface Player {
  id: number;
  name: string;
  isEliminated: boolean;
  chambers: number[]; // Bullet chambers
  firedChambers: boolean[]; // Fired status for each chamber
  currentChamberIndex: number; // Index of the chamber being fired
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gameStarted: boolean;
  setPlayers: (players: Player[]) => void;
  addPlayer: (name: string) => void;
  eliminatePlayer: (playerId: number) => void;
  fireChamber: (playerId: number) => void;
  resetGame: () => void;
  restartGame: () => void;
  startGame: () => void;
  nextPlayer: () => void;
}

// Helper function to create initial chambers with a random bullet position
const createInitialChambers = () => {
  const chambers = Array(6).fill(0);
  const bulletIndex = Math.floor(Math.random() * 6);
  chambers[bulletIndex] = 1; // Bullet is in this chamber
  return chambers;
};

// Utility function to save game state to localStorage
const saveGameStateToLocalStorage = (state: GameState) => {
  if (typeof window !== "undefined")
    localStorage.setItem("gameState", JSON.stringify(state));
};

// Utility function to load game state from localStorage
const loadGameStateFromLocalStorage = (): GameState | null => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      return JSON.parse(savedState);
    }
  }
  return null;
};

export const useGameStore = create<GameState>((set, get) => {
  // Load state from localStorage, if available
  const savedState = loadGameStateFromLocalStorage();

  // Default state if there's no saved game
  const initialState = savedState || {
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
  };

  return {
    ...initialState,
    setPlayers: (players) => {
      set({ players });
      saveGameStateToLocalStorage({ ...get(), players });
    },

    addPlayer: (name) => {
      const { players } = get();
      const newPlayer: Player = {
        id: players.length,
        name: name || `Player ${players.length + 1}`,
        isEliminated: false,
        chambers: createInitialChambers(),
        firedChambers: Array(6).fill(false),
        currentChamberIndex: 0,
      };
      const newPlayers = [...players, newPlayer];
      set({ players: newPlayers });
      saveGameStateToLocalStorage({ ...get(), players: newPlayers });
    },

    eliminatePlayer: (playerId) => {
      set((state) => {
        const updatedPlayers = state.players.map((player) =>
          player.id === playerId ? { ...player, isEliminated: true } : player
        );
        saveGameStateToLocalStorage({ ...state, players: updatedPlayers });
        return { players: updatedPlayers };
      });
    },

    fireChamber: (playerId) => {
      const { players, nextPlayer } = get();
      const player = players.find((p) => p.id === playerId);
      if (!player) return;

      const updatedPlayers = players.map((p) => {
        if (p.id === playerId) {
          const newFiredChambers = [...p.firedChambers];
          newFiredChambers[p.currentChamberIndex] = true;

          if (p.chambers[p.currentChamberIndex] === 1) {
            return {
              ...p,
              isEliminated: true,
              firedChambers: newFiredChambers,
            };
          }

          return {
            ...p,
            currentChamberIndex: (p.currentChamberIndex + 1) % 6,
            firedChambers: newFiredChambers,
          };
        }
        return p;
      });

      set({ players: updatedPlayers });
      saveGameStateToLocalStorage({ ...get(), players: updatedPlayers });
      nextPlayer();
    },

    resetGame: () => {
      set((state) => {
        const resetPlayers = state.players.map((player) => ({
          ...player,
          isEliminated: false,
          chambers: createInitialChambers(),
          firedChambers: Array(6).fill(false),
          currentChamberIndex: 0,
        }));
        saveGameStateToLocalStorage({ ...state, players: resetPlayers });
        return { players: resetPlayers, currentPlayerIndex: 0 };
      });
    },

    restartGame: () => {
      set({ players: [], currentPlayerIndex: 0, gameStarted: false });
      saveGameStateToLocalStorage(get());
    },

    startGame: () => {
      set({ gameStarted: true });
      saveGameStateToLocalStorage(get());
    },

    nextPlayer: () => {
      const { players, currentPlayerIndex } = get();
      let nextIndex = (currentPlayerIndex + 1) % players.length;

      // Find the next non-eliminated player
      while (
        players[nextIndex].isEliminated &&
        players.some((p) => !p.isEliminated)
      ) {
        nextIndex = (nextIndex + 1) % players.length;
      }

      set({ currentPlayerIndex: nextIndex });
      saveGameStateToLocalStorage(get());
    },
  };
});

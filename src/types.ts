export interface GameSettings {
  timeLimit: number;
  selectedNumber: number;
}

export interface GameState {
  selectedNumber: number | null;
  currentNumberIndex: number;
  secondsRemaining: number | null;
  lastSelection: number | null;
  settings: GameSettings;
}

export interface UserInitiatedGameActions {
  selectNumber(gameState: GameState, selectedNumber: number): GameState;
  startNewGame(gameState: GameState): GameState;
  makeSelection(gamestate: GameState, guess: number): GameState;
}

export interface SystemGameActions {
  incrementTime(gameState: GameState): GameState;
}

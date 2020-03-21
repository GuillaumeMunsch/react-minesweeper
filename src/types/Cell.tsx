export enum CellState {
    UNDISCOVERED,
    DISCOVERED,
    FLAGGED,
}

export interface Cell {
  state: CellState;
  neighbourMines: number;
  mined: boolean;
}

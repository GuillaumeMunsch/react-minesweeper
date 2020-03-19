export enum CellState {
    UNDISCOVERED,
    DISCOVERED,
    FLAGGED,
}

export interface Cell {
  state: CellState;
  neighborMines: number;
  mined: boolean;
}

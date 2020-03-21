import { Cell, CellState } from 'types/Cell';

const isCellClearable = (gameMap: Cell[][], x: number, y: number): boolean => {
  if (
    gameMap[x][y]?.state === CellState.UNDISCOVERED &&
    gameMap[x][y]?.neighbourMines === 0 &&
    !gameMap[x][y]?.mined
  )
    return true;
  return false;
};

export default isCellClearable;

import React, { Component, ReactNode } from 'react';
import { Cell, CellState } from 'types/Cell';
import { GameType } from 'types/GameType';
import { GameState } from 'types/GameState';
import flag from 'assets/flag.svg';
import bomb from 'assets/bomb.svg';
import './App.css';

interface Props {}

interface State {
  gameType: GameType;
  gameMap: Cell[][];
  mines: number;
  gameState: GameState;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gameType: GameType.SMALL,
      gameMap: [],
      mines: 10,
      gameState: GameState.INITIAL,
    };
  }

  componentWillMount() {
    this.createGame();
  }

  createGame = () => {
    let x: number, y: number, mines: number;
    switch (this.state.gameType) {
      case GameType.SMALL:
        x = y = 10;
        mines = 10;
        break;
      case GameType.MEDIUM:
        x = y = 16;
        mines = 40;
        break;
      default:
        x = 16;
        y = 30;
        mines = 99;
        break;
    }
    let gameMap: Cell[][] = [];
    for (let i = 0; i < x; i++) {
      gameMap = [
        ...gameMap,
        [...Array(y)].map(() => ({
          mined: false,
          neighbourMines: 0,
          state: CellState.UNDISCOVERED,
        })),
      ];
    }
    this.setState({
      gameMap,
      mines,
    });
  };

  startGame = (pressedX: number, pressedY: number) => {
    let gameMap = [...this.state.gameMap.map(row => [...row])];
    let x: number, y: number;
    for (let { mines } = this.state; mines > 0; mines--) {
      let minePlaced = false;
      while (!minePlaced) {
        x = Math.floor(Math.random() * Math.floor(gameMap.length));
        y = Math.floor(Math.random() * Math.floor(gameMap[0].length));
        if ((x === pressedX && y === pressedY) || gameMap[x][y].mined) continue;
        gameMap[x][y].mined = true;
        minePlaced = true;
      }
    }
    for (let i = 0; i < this.state.gameMap.length; i++) {
      for (let j = 0; j < this.state.gameMap[i].length; j++) {
        let neighbourBombs = 0;
        if (i - 1 >= 0 && j - 1 >= 0 && gameMap[i - 1][j - 1]?.mined) neighbourBombs++; // Top left
        if (j - 1 >= 0 && gameMap[i][j - 1]?.mined) neighbourBombs++; // Top
        if (i + 1 < gameMap.length && j - 1 >= 0 && gameMap[i + 1][j - 1]?.mined) neighbourBombs++; // Top right
        if (i - 1 >= 0 && gameMap[i - 1][j]?.mined) neighbourBombs++; // Left
        if (i + 1 < gameMap.length && gameMap[i + 1][j]?.mined) neighbourBombs++; // Right
        if (i - 1 >= 0 && j + 1 <= gameMap[i].length && gameMap[i - 1][j + 1]?.mined)
          neighbourBombs++; // Bottom left
        if (j + 1 <= gameMap[i].length && gameMap[i][j + 1]?.mined) neighbourBombs++; // Bottom
        if (i + 1 < gameMap.length && j + 1 <= gameMap[i].length && gameMap[i + 1][j + 1]?.mined)
          neighbourBombs++; // Bottom right
        gameMap[i][j].neighbourMines = neighbourBombs;
      }
    }
    gameMap = this.clearCell(gameMap, pressedX, pressedY);
    this.setState({ gameMap, gameState: GameState.RUNNING });
  };

  loseGame = (x: number, y: number) => {
    const gameMap = [...this.state.gameMap.map(row => [...row])];
    for (let i = 0; i < this.state.gameMap.length; i++) {
      for (let j = 0; j < this.state.gameMap[i].length; j++) {
        if (gameMap[i][j].mined && gameMap[i][j].state !== CellState.FLAGGED)
          gameMap[i][j].state = CellState.DISCOVERED;
      }
    }
    gameMap[x][y].minePressed = true;
    this.setState({
      gameMap,
      gameState: GameState.LOST,
    });
  };

  flagCell = (x: number, y: number) => {
    const gameMap = [...this.state.gameMap.map(row => [...row])];
    gameMap[x][y].state =
      gameMap[x][y].state === CellState.FLAGGED ? CellState.UNDISCOVERED : CellState.FLAGGED;
    this.setState({ gameMap });
  };

  clearCell = (propsMap: Cell[][], x: number, y: number): Cell[][] => {
    let gameMap = [...propsMap.map(row => [...row])];
    gameMap[x][y].state = CellState.DISCOVERED;
    if (gameMap[x][y].neighbourMines === 0) {
      if (x - 1 >= 0 && y - 1 >= 0 && gameMap[x - 1][y - 1]?.state === CellState.UNDISCOVERED)
        gameMap = this.clearCell(gameMap, x - 1, y - 1); // Top left
      if (y - 1 >= 0 && gameMap[x][y - 1]?.state === CellState.UNDISCOVERED)
        gameMap = this.clearCell(gameMap, x, y - 1); // Top
      if (
        x + 1 < gameMap.length &&
        y - 1 >= 0 &&
        gameMap[x + 1][y - 1]?.state === CellState.UNDISCOVERED
      )
        gameMap = this.clearCell(gameMap, x + 1, y - 1); // Top right
      if (x - 1 >= 0 && gameMap[x - 1][y]?.state === CellState.UNDISCOVERED)
        gameMap = this.clearCell(gameMap, x - 1, y); // Left
      if (x + 1 < gameMap.length && gameMap[x + 1][y]?.state === CellState.UNDISCOVERED)
        gameMap = this.clearCell(gameMap, x + 1, y); // Right
      if (
        x - 1 >= 0 &&
        y + 1 <= gameMap[x].length &&
        gameMap[x - 1][y + 1]?.state === CellState.UNDISCOVERED
      )
        gameMap = this.clearCell(gameMap, x - 1, y + 1); // Bottom left
      if (y + 1 <= gameMap[x].length && gameMap[x][y + 1]?.state === CellState.UNDISCOVERED)
        gameMap = this.clearCell(gameMap, x, y + 1); // Bottom
      if (
        x + 1 < gameMap.length &&
        y + 1 <= gameMap[x].length &&
        gameMap[x + 1][y + 1]?.state === CellState.UNDISCOVERED
      )
        gameMap = this.clearCell(gameMap, x + 1, y + 1); // Bottom right
    }
    // this.setState({ gameMap });
    return gameMap;
  };

  onClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, x: number, y: number): void => {
    if (this.state.gameState !== GameState.LOST)
      if (e.type === 'click') {
        if (this.state.gameState === GameState.INITIAL) {
          return this.startGame(x, y);
        } else if (this.state.gameMap[x][y].mined) {
          this.loseGame(x, y);
        }
        const gameMap = this.clearCell(this.state.gameMap, x, y);
        this.setState({ gameMap });
      } else if (e.type === 'contextmenu' && this.state.gameState === GameState.RUNNING) {
        this.flagCell(x, y);
      }
  };

  renderCell = (cell: Cell, x: number, y: number) => {
    return (
      <div
        className={`cell ${cell.state === CellState.DISCOVERED &&
          'cell-discovered'} ${cell.state === CellState.FLAGGED &&
          'cell-flagged'} ${cell.minePressed && 'cell-mine-pressed'}`}
        onContextMenu={e => this.onClickCell(e, x, y)}
        onClick={e => this.onClickCell(e, x, y)}
        key={`${x}-${y}`}
      >
        <span className="cell-text">{this.renderCellContent(cell)}</span>
      </div>
    );
  };

  renderCellContent = (cell: Cell) => {
    switch (cell.state) {
      case CellState.UNDISCOVERED:
        return <span></span>;
      case CellState.DISCOVERED: {
        if (cell.mined) {
          return <img src={bomb} className="App-icon" alt="bomb" />;
        }
        return <span>{cell.neighbourMines}</span>;
      }
      case CellState.FLAGGED:
        return <img src={flag} className="App-icon" alt="flag" />;
    }
  };

  renderGame = (): ReactNode => (
    <div>
      {this.state.gameMap.map((row, x) => (
        <div className="row" key={x}>
          {row.map((cell, y) => this.renderCell(cell, x, y))}
        </div>
      ))}
    </div>
  );

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <a
            href="!#"
            className="btn"
            onClick={() =>
              this.setState(
                { gameType: GameType.SMALL, gameState: GameState.INITIAL },
                this.createGame
              )
            }
          >
            SMALL
          </a>
          <a
            href="!#"
            className="btn"
            onClick={() =>
              this.setState(
                { gameType: GameType.MEDIUM, gameState: GameState.INITIAL },
                this.createGame
              )
            }
          >
            MEDIUM
          </a>
          <a
            href="!#"
            className="btn"
            onClick={() =>
              this.setState(
                { gameType: GameType.BIG, gameState: GameState.INITIAL },
                this.createGame
              )
            }
          >
            BIG
          </a>
        </div>
        <header className="App-game">
          <div>{this.renderGame()}</div>
        </header>
      </div>
    );
  }
}

export default App;

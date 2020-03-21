import React, { Component, ReactNode } from 'react';
import { Cell, CellState } from 'types/Cell';
import { GameType } from 'types/GameType';
import { GameState } from 'types/GameState';
import flag from 'assets/flag.svg';
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
          neighborMines: 0,
          state: CellState.DISCOVERED,
        })),
      ];
    }
    console.log('GameMAP initial', gameMap);
    this.setState({
      gameMap,
      mines,
    });
  };

  startGame = (pressedX: number, pressedY: number) => {
    const gameMap = [...this.state.gameMap.map(row => [...row])];
    let x: number, y: number;
    for (let { mines } = this.state; mines > 0; mines--) {
      let minePlaced = false;
      while (!minePlaced) {
        x = Math.floor(Math.random() * Math.floor(gameMap.length));
        y = Math.floor(Math.random() * Math.floor(gameMap[0].length));
        console.log(x, y);
        if ((x === pressedX && y === pressedY) || gameMap[x][y].mined) continue;
        gameMap[x][y].mined = true;
        minePlaced = true;
      }
    }

    console.log(gameMap);
    // for (let i = 0; i < this.state.gameMap.length; i++) {
    //   for (let j = 0; j < this.state.gameMap[i].length; j++) {
    //     // console.log(i, j);
    //     console.log('LA ?');
    //   }
    // }

    gameMap[pressedX][pressedY].state = CellState.DISCOVERED;
    this.setState({ gameMap, gameState: GameState.RUNNING });
  };

  onClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, x: number, y: number): void => {
    console.log(x, y);
    if (this.state.gameState !== GameState.LOST)
      if (e.type === 'click') {
        if (this.state.gameState === GameState.INITIAL) {
          console.log('Go ?');
          return this.startGame(x, y);
        }
        // Manage normal click events
        console.log('Left click');
      } else if (e.type === 'contextmenu') {
        console.log('Right click');
      }
  };

  renderCell = (cell: Cell, x: number, y: number) => {
    return (
      <div
        className={`cell ${cell.state === CellState.DISCOVERED &&
          'cell-discovered'} ${cell.state === CellState.FLAGGED && 'cell-flagged'}`}
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
          return <span>X</span>;
        }
        return <span>{cell.neighborMines}</span>;
      }
      case CellState.FLAGGED:
        return <img src={flag} className="App-logo" alt="logo" />;
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

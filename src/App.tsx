import React, { Component, ReactNode } from 'react';
import { Cell, CellState } from 'types/Cell';
import { GameType } from 'types/GameType';
import './App.css';

interface Props {}

interface State {
  gameSize: GameType;
  gameMap: Cell[][];
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gameSize: GameType.SMALL,
      gameMap: [
        [
          { state: CellState.UNDISCOVERED, neighborMines: 1, mined: true },
          { state: CellState.DISCOVERED, neighborMines: 2, mined: true },
        ],
        [
          { state: CellState.DISCOVERED, neighborMines: 3, mined: true },
          { state: CellState.DISCOVERED, neighborMines: 4, mined: true },
        ],
      ],
    };
  }

  onClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, x: number, y: number): void => {
    console.log(x, y);
    if (e.type === 'click') {
      console.log('Left click');
    } else if (e.type === 'contextmenu') {
      console.log('Right click');
      e.stopPropagation();
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
        <span className="cell-text">{cell.neighborMines}</span>
      </div>
    );
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
          <a className="btn">SMALL</a>
          <a className="btn">MEDIUM</a>
          <a className="btn">BIG</a>
        </div>
        <header className="App-game">
          <div>{this.renderGame()}</div>
        </header>
      </div>
    );
  }
}

export default App;

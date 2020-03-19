import React, { Component, ReactNode } from 'react';
import { Cell, CellState } from 'types/Cell';
import './App.css';

interface Props {}

interface State {
  gameMap: Cell[][];
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gameMap: [
        [
          { state: CellState.UNDISCOVERED, neighborMines: 1, mined: true },
          { state: CellState.UNDISCOVERED, neighborMines: 2, mined: true },
        ],
        [
          { state: CellState.UNDISCOVERED, neighborMines: 3, mined: true },
          { state: CellState.UNDISCOVERED, neighborMines: 4, mined: true },
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

  renderGame = (): ReactNode => (
    <div>
      {this.state.gameMap.map((row, x) => (
        <div className="row" key={x}>
          {row.map((cell, y) => (
            <div
              className="cell"
              onContextMenu={e => this.onClickCell(e, x, y)}
              onClick={e => this.onClickCell(e, x, y)}
              key={`${x}-${y}`}
            >
              <span className="cell-text">{cell.neighborMines}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>{this.renderGame()}</div>
        </header>
      </div>
    );
  }
}

export default App;

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

  onClickCell = (
    e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>,
    x: number,
    y: number
  ): void => {
    console.log(x, y);
    if (e.type === 'click') {
      console.log('Left click');
    } else if (e.type === 'contextmenu') {
      console.log('Right click');
      e.stopPropagation();
    }
  };

  renderGame = (): ReactNode => (
    <table>
      {this.state.gameMap.map((row, x) => (
        <tr>
          {row.map((cell, y) => (
            <td
              onContextMenu={e => this.onClickCell(e, x, y)}
              onClick={e => this.onClickCell(e, x, y)}
            >
              {cell.neighborMines}
            </td>
          ))}
        </tr>
      ))}
    </table>
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

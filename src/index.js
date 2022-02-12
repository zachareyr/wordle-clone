import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class NextRowButton extends React.Component {
  render() {
    let _class = "next-row "
    if (this.props.active) {
      _class += "next-row-active"
    } else {
      _class += "next-row-inactive"
    }
    return (
    <div className={_class} onClick={this.props.onClick}>
      <p>{'>'}</p>
    </div>
    )
  } 
}

class Square extends React.Component {
  render()
  {
    let _class = "square"
    if (this.props.selected) {
      _class += " square-active"
    }
    switch (this.props.status) {
      // 0: empty, 1: wrong, 2: wrong place, 3: correct
      case 1:
        _class += " square-wrong"
        break;
      case 2:
        _class += " square-wrong-position"
        break;
      case 3:
        _class += " square-correct"
        break;
    }
    return (
      <div className={_class}
      onClick={() => this.props.onClick()}>
        <p>{this.props.value}</p>
      </div>
    )
    } 
  }
class KeyboardSquare extends React.Component {
  render()
  {
    let name = "keyboard-square"
    if (this.props.width==2) {
      name+=" keyboard-square-width-2"
    } else {
      switch (this.props.status) {
        case 1:
          name+=" keyboard-square-wrong"
          break;
        case 2:
          name+=" keyboard-square-wrong-position"
          break;
        case 3:
          name+=" keyboard-square-correct"
          break;
      }
    }
    return (
      <button className={name}
      onClick={() => this.props.onClick()}>
        <p>{this.props.value}</p>
      </button>
    )
  }
}

class Game extends React.Component {
  
  constructor(props)
  {
    super(props);
    this.state = {
      squares: Array(25).fill(null),
      keyboard: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter", "Z", "X", "C", "V", "B", "N", "M", "<-"],
      keyboardStatus: Array(28).fill(0),
      status: Array(25).fill(0),
      row: 0,
      column: 0,
      word: ["M", "I", "K", "E", "Y"]
    };
  }

  endGame(win) {
    // win = true: won
    // win = false: lost
    // TODO this function
    alert(win)
  }
  renderKeyBoardSquare(i)
  {
    // 19 / 27
    if (i == 19 || i == 27) {
      return <KeyboardSquare
      value={this.state.keyboard[i]}
      onClick={() => this.handleKeyboardClick(i)}
      width={2} />
    }
    return <KeyboardSquare
    value={this.state.keyboard[i]} 
    status={this.state.keyboardStatus[i]}
    onClick={() => this.handleKeyboardClick(i)} 
    width={1}
    />
  }
  
  renderSquare(i, status)
  {
    let selected = false;
    if (this.state.column == 5) { 
      selected = false
    } else if (this.state.row * 5 + this.state.column == i) selected = true;
    return <Square
    value={this.state.squares[i]}
    status={status}
    selected={selected}
    />
  }

  createNextRowButton(i) {
    let active = false;
    if (this.state.row == i && this.state.column == 5) {
      active = true;
    }
    return (
      <NextRowButton
        onClick={() => this.handleNextRowClick()}
        active={active}
      />
    )
  }

  handleNextRowClick() {
    // TODO check against word, highlight squares on board and keyboard
    if (this.state.row == 4) {
      this.endGame(false)
    }
    let status = this.state.status;
    for (let i=0; i<5; i++) {
      if (this.state.squares[this.state.row*5+i] == this.state.word[i]) {
        status[this.state.row*5+i] = 3
      } else {
        let letterInWord = false;
        for (let j=0; j<this.state.word.length; j++) {
          if (this.state.word[j] === this.state.squares[this.state.row*5+i]) {
            letterInWord = true
            break
          }
        }
        if (letterInWord) {
          status[this.state.row*5+i] = 2
        } else {
          status[this.state.row*5+i] = 1
        }
      }

    }
    this.setState({
      status: status
    })

    let wordIsCorrect=true // iterate through all letters of the word, and if none of them are wrong, end the game
    let keyboardStatus = this.state.keyboardStatus;
    for (let i=0; i<5; i++) {
      keyboardStatus[this.state.keyboard.indexOf(this.state.squares[this.state.row*5+i])] = this.state.status[this.state.row*5+i]
      if (this.state.status[this.state.row*5+i] != 3) {
        wordIsCorrect = false
      }
    }
    if (wordIsCorrect) {
      this.endGame(true)
      return
    }
    this.setState({
      keyboardStatus: keyboardStatus,
      column: 0,
      row: this.state.row+1,
    })
  }

  handleKeyboardClick(i)
  {
    // 19 : enter
    // 27 : backspace
    let column = this.state.column
    let row = this.state.row
    let squares = this.state.squares;

    if (i == 27) {
      if (column != 0) {
        column -= 1
        squares[row * 5+column] = null
      }
    } else if (i==19) {
      if (column == 5) {
        this.handleNextRowClick()
        return
      }
    } else {
      if (column == 5) return
      column += 1
      squares[(this.state.row)*5+this.state.column] = this.state.keyboard[i]
    }
    
    this.setState({
      squares: squares,
      column: column,
      row: row,
    });
  }

  render()
  {
    return (
      <React.Fragment>
        <div className="board">
          <div className="title-text">Wordle Clone</div>
          <div className="board-row">
            {this.renderSquare(0,this.state.status[0])}
            {this.renderSquare(1,this.state.status[1])}
            {this.renderSquare(2,this.state.status[2])}
            {this.renderSquare(3,this.state.status[3])}
            {this.renderSquare(4,this.state.status[4])}
            {this.createNextRowButton(0)}
          </div>
          <div className="board-row">
            {this.renderSquare(5,this.state.status[5])}
            {this.renderSquare(6,this.state.status[6])}
            {this.renderSquare(7,this.state.status[7])}
            {this.renderSquare(8,this.state.status[8])}
            {this.renderSquare(9,this.state.status[9])}
            {this.createNextRowButton(1)}
          </div>
          <div className="board-row">
            {this.renderSquare(10,this.state.status[10])}
            {this.renderSquare(11,this.state.status[11])}
            {this.renderSquare(12,this.state.status[12])}
            {this.renderSquare(13,this.state.status[13])}
            {this.renderSquare(14,this.state.status[14])}
            {this.createNextRowButton(2)}
            </div>
          <div className="board-row">
            {this.renderSquare(15,this.state.status[15])}
            {this.renderSquare(16,this.state.status[16])}
            {this.renderSquare(17,this.state.status[17])}
            {this.renderSquare(18,this.state.status[18])}
            {this.renderSquare(19,this.state.status[19])}
            {this.createNextRowButton(3)}
          </div>
          <div className="board-row">
            {this.renderSquare(20,this.state.status[20])}
            {this.renderSquare(21,this.state.status[21])}
            {this.renderSquare(22,this.state.status[22])}
            {this.renderSquare(23,this.state.status[23])}
            {this.renderSquare(24,this.state.status[24])}
            {this.createNextRowButton(4)}
          </div>
        </div>
        <div className="keyboard">
          <div className="keyboard-row">
            <div className="quarter-fill"></div>
            <div className="quarter-fill"></div>
            {this.renderKeyBoardSquare(0)}
            {this.renderKeyBoardSquare(1)}
            {this.renderKeyBoardSquare(2)}
            {this.renderKeyBoardSquare(3)}
            {this.renderKeyBoardSquare(4)}
            {this.renderKeyBoardSquare(5)}
            {this.renderKeyBoardSquare(6)}
            {this.renderKeyBoardSquare(7)}
            {this.renderKeyBoardSquare(8)}
            {this.renderKeyBoardSquare(9)}
          </div>
          <div className="keyboard-row">
            <div className="quarter-fill"></div>
            <div className="quarter-fill"></div>
            <div className="quarter-fill"></div>
            <div className="quarter-fill"></div>
            {this.renderKeyBoardSquare(10)}
            {this.renderKeyBoardSquare(11)}
            {this.renderKeyBoardSquare(12)}
            {this.renderKeyBoardSquare(13)}
            {this.renderKeyBoardSquare(14)}
            {this.renderKeyBoardSquare(15)}
            {this.renderKeyBoardSquare(16)}
            {this.renderKeyBoardSquare(17)}
            {this.renderKeyBoardSquare(18)}
          </div>
          <div className="keyboard-row">
            {this.renderKeyBoardSquare(19)}
            {this.renderKeyBoardSquare(20)}
            {this.renderKeyBoardSquare(21)}
            {this.renderKeyBoardSquare(22)}
            {this.renderKeyBoardSquare(23)}
            {this.renderKeyBoardSquare(24)}
            {this.renderKeyBoardSquare(25)}
            {this.renderKeyBoardSquare(26)}
            {this.renderKeyBoardSquare(27)}
          </div>
        </div>
      </React.Fragment>
    )
  }
}


ReactDOM.render(
  <Game
   />,
  document.getElementById('root')
);


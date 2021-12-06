import './App.css';
import React, {useState} from 'react'
import Card from "@heruka_urgyen/react-playing-cards/lib/TcB"

const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
const suits = ["c", "d", "h", "s"]
const totalCards = 52;

/* Generates and shuffles an array containing 0..51 using a Schwartzian transform.
 * Note: an inside-out Fisher-Yates shuffle would improve this from O(nlogn) to O(n). But I find this more readable and 52 isn't many.
 * See https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function generateNewBoard() {
  return [...Array(totalCards).keys()]
    .map((value) => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value);
}

function groupBoardIndicesIntoRows(cardsPerRow) {
  var rows = [];
  for (var i = 0; i < totalCards; ++i) {
    if (i % cardsPerRow === 0) {
      rows.push([]);
    }
    var row = Math.floor(i / cardsPerRow);
    rows[row].push(i);
  }
  return rows;
}

function MemoryCard(props) {
  return (
    <Card card={ranks[props.cardNum % 13] + suits[Math.floor(props.cardNum / 13)]} height="100px" />
  );
}

function Game(props) {
  // eslint-disable-next-line
  const [matched, setMatched] = useState(Array(totalCards).fill(false));

  
  return (
    <div>
      {props.rows.map((row, idx) =>
        <ul key={idx}>
          {row.map(cardIdx =>
            <MemoryCard key={props.board[cardIdx]} cardNum={props.board[cardIdx]}/>
            )}
        </ul>)}
    </div>
  );
}

function App() {
  // eslint-disable-next-line
  const [board, setBoard] = useState(generateNewBoard());
  // eslint-disable-next-line
  const [rows, setRows] = useState(groupBoardIndicesIntoRows(13));

  return (
    <div className="App">
      <Game rows={rows} board={board} />
    </div>
  );
}

export default App;

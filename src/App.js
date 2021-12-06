import './App.css';
import React, {useState} from 'react'
import Card from "@heruka_urgyen/react-playing-cards/lib/TcB"

const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
const suits = ["c", "s", "h", "d"]

/* Generates and shuffles an array containing 0..51 using a Schwartzian transform.
 * Note: an inside-out Fisher-Yates shuffle would improve this from O(nlogn) to O(n). But I find this more readable and 52 isn't many.
 * See https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function generateNewBoard(totalCards) {
  return [...Array(totalCards).keys()]
    .map((value) => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value);
}

function groupBoardIndicesIntoRows(cardsPerRow, totalCards) {
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

function isMatch(card1, card2, requireColorMatch, numRanks) {
  var ranksMatch = (card1 % numRanks) === (card2 % numRanks);
  if (!requireColorMatch) {
    return ranksMatch;
  }
  var card1Suit = Math.floor(card1 / numRanks);
  var card2Suit = Math.floor(card2 / numRanks);
  var colorsMatch = (card1Suit + card2Suit) === 1 || (card1Suit + card2Suit) === 5;
  return ranksMatch && colorsMatch;
}

function MemoryCard(props) {
  return (
    <div onClick={props.isClickable ? () => props.onCardClicked(props.cardIndex) : undefined} >
      <Card
        card={ranks[props.cardNum % props.numRanks] + suits[Math.floor(props.cardNum / props.numRanks)]}
        height="100px"
        style={props.isSelected ? {"border": "5px solid #555"} : {"padding": "5px"}}
        back={props.isClickable && !props.isSelected}/>
    </div>
  );
}

function Game(props) {
  const [firstSelection, setFirstSelection] = useState(undefined);
  const [secondSelection, setSecondSelection] = useState(undefined);

  var matched = props.matched;
  var setMatched = props.setMatched;
  var clearSelections = function() {
    setFirstSelection(undefined);
    setSecondSelection(undefined);
  };

  var onCardClicked = function(cardIndex) {
    if (firstSelection === undefined) {
      setFirstSelection(cardIndex);
      console.log('set first selection to %s', cardIndex);
    } else if (secondSelection === undefined) {
      setSecondSelection(cardIndex);
      console.log('set second selection to %s', cardIndex);

      // if match
      if (isMatch(props.board[firstSelection], props.board[cardIndex], props.requireColorMatch, props.numRanks)) {
        var newMatches = [...matched];
        newMatches[firstSelection] = true;
        newMatches[cardIndex] = true;
        setMatched(newMatches);

        // if game over
        if (newMatches.every(matched => matched)) {
          props.setGameOver(true);
        }
        clearSelections();
      } else {
        // if not match
        setTimeout(clearSelections, 2000);
      }
    }
  };

  var isClickable = function(cardIndex) {
    return !matched[cardIndex] && (cardIndex !== firstSelection) && (cardIndex !== secondSelection);
  }

  var isSelected = cardIndex => cardIndex === firstSelection || cardIndex === secondSelection;
  
  return (
    <div>
      {props.rows.map((row, idx) =>
        <ul key={idx} className="cards">
          {row.map(cardIdx =>
            <li key={cardIdx}>
              <MemoryCard
                cardNum={props.board[cardIdx]}
                cardIndex={cardIdx}
                onCardClicked={onCardClicked}
                isClickable={isClickable(cardIdx)}
                isSelected={isSelected(cardIdx)}
                numRanks={props.numRanks}/>
            </li>
          )}
        </ul>)}
    </div>
  );
}

function App() {
  const [board, setBoard] = useState(generateNewBoard(52));
  const [matched, setMatched] = useState(Array(52).fill(false));
  const [rows, setRows] = useState(groupBoardIndicesIntoRows(13, 52));
  const [gameOver, setGameOver] = useState(true);
  const [requireColorMatch, setRequireColorMatch] = useState(true);
  const [showBoard, setShowBoard] = useState(false);
  const [numRanks, setNumRanks] = useState(13);
  const [numSuits, setNumSuits] = useState(4);

  var startNewGame = function() {
    setBoard(generateNewBoard(numRanks * numSuits));
    setMatched(Array(numRanks * numSuits).fill(false));
    setRows(groupBoardIndicesIntoRows(numRanks, numSuits * numRanks));
    setGameOver(false);
    setShowBoard(true);
  }

  return (
    <div className="App">
      <div style={{display: gameOver ? "block" : "none"}}>
        <h1>Configuration</h1>
        <label>
          <select value={numSuits} onChange={e => setNumSuits(e.target.value)}>
            <option value="2">2</option>
            <option value="4">4</option>
          </select>
          Number of Suits
        </label><br/>
        <label>
          <select value={numRanks} onChange={e => setNumRanks(e.target.value)}>
            {[...Array(ranks.length).keys()].map(val =>
              <option key={val+1} value={val+1}>{val+1}</option>)}
          </select>
          Number of Ranks
        </label><br/>
        <div style={{display: numSuits === 4 ? "block" : "none"}}>
          <label>
            <input type="checkbox" checked={requireColorMatch} onChange={_ => setRequireColorMatch(!requireColorMatch)}/>
            Require Color Match
          </label><br/>
        </div>
        <button onClick={startNewGame}>
          New Game
        </button>
      </div>
      <div style={{display: showBoard ? "block" : "none"}}>
        <Game 
          rows={rows} 
          board={board} 
          setGameOver={setGameOver} 
          requireColorMatch={requireColorMatch} 
          numRanks={numRanks} 
          numSuits={numSuits}
          matched={matched}
          setMatched={setMatched}/>
      </div>
    </div>
  );
}

export default App;

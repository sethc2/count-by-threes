import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import logo from "./logo.svg";
import "./App.css";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function App() {
  const [selectedNumber, setSelectedNumber] = useState(3);
  const [selectedNumberInput, setSelectedNumberInput] = useState(
    selectedNumber.toString()
  );
  const [maxToAddTo, setMaxToAddTo] = useState(10);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [wrongGuess, setWrongGuess] = useState<number | null>(null);

  const [wrongGuessCount, setWrongGuessCount] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  const [timePassed, setTimePassed] = useState(0);

  const timePassedRef = useRef(timePassed);

  timePassedRef.current = timePassed;

  const buttonResults = useMemo(() => {
    const results = new Set<number>();
    for (let i = 1; i <= maxToAddTo; i++) {
      const result = selectedNumber * i;
      results.add(result);
      // results.add(
      //   <div key={i}>
      //     <button className="numberContainerButton" onClick={() => }>
      //       {selectedNumber * i}
      //     </button>
      //   </div>
      // );
    }
    while (results.size < 16) {
      results.add(getRandomInt(maxToAddTo * selectedNumber) + 1);
    }
    return Array.from(results)
      .sort(() => getRandomInt(2) - 1)
      .map((x) => ({ value: x }));
  }, [maxToAddTo, selectedNumber]);

  const selectNumber = (numberPicked: number) => {
    if (numberPicked === nextAnswer) {
      if (currentIndex === maxToAddTo) {
        setGameOver(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        timerRef.current = null;
      } else {
        setWrongGuess(null);
        setCurrentIndex(currentIndex + 1);
      }
    } else if (wrongGuess != numberPicked) {
      setWrongGuess(numberPicked);
      setWrongGuessCount(wrongGuessCount + 1);
    }
  };

  const nextAnswer = selectedNumber * currentIndex;
  return (
    <div className="layoutContainer">
      <div className="layoutTop">Count by</div>
      <div className="layoutMiddle">
        {(gameOver || !gameStarted) && (
          <input
            value={selectedNumberInput}
            type="number"
            onChange={(e) => setSelectedNumberInput(e.target.value)}
          ></input>
        )}
        {gameOver && (
          <div>
            <div>It took you {timePassed} seconds</div>
            <div>You missed {wrongGuessCount}</div>
          </div>
        )}
        {!gameOver && gameStarted && (
          <>
            <div>{timePassed}</div>
            <div className="selectedNumber">{selectedNumber}</div>
            <div className="timesSign">X</div>
            <div className="index">{currentIndex}</div>
          </>
        )}
      </div>
      <div className="layoutAuto">
        {(!gameStarted || gameOver) && (
          <div>
            <button
              onClick={() => {
                setSelectedNumber(
                  Number.parseInt(selectedNumberInput) || selectedNumber
                );
                setGameStarted(true);
                setGameOver(false);
                setCurrentIndex(1);
                setWrongGuessCount(0);
                timerRef.current = window.setInterval(() => {
                  setTimePassed(timePassedRef.current + 1);
                }, 1000);
                // window.setInterval(() => {
                //   setCurrentIndex()
                // })
              }}
            >
              Click to start
            </button>
          </div>
        )}
        {gameStarted && !gameOver && (
          <div className="numberContainer">
            {buttonResults.map((x) => (
              <div key={x.value}>
                <button
                  className="numberContainerButton"
                  onClick={() => {
                    selectNumber(x.value);
                  }}
                  style={{
                    background:
                      x.value / selectedNumber < currentIndex &&
                      x.value % selectedNumber === 0
                        ? "green"
                        : x.value === wrongGuess
                        ? "red"
                        : undefined,
                  }}
                >
                  {x.value}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

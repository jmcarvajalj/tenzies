import { useState, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {
  //state to manage the dices
  const [dice, setDice] = useState(allNewDice())
  //state to manage win condition
  const [tenzies, setTenzies] = useState(false)
  //state to manage number of rolls
  const [rolls, setRolls] = useState(0)
  //state to store time
  const [time, setTime] = useState(0)
  //state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false)
  //state to manage best score
  const [bestTime, setBestTime] = useState(JSON.parse(localStorage.getItem("bestTime")) || 0)

  //useEffect to manage time
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  //useEffect to validate win condition
  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      setIsRunning(false)
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }    
    }
  }, [dice, bestTime, time])  

  useEffect(() => {
    localStorage.setItem("bestTime", JSON.stringify(bestTime));
  }, [bestTime]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (!tenzies) {
      setIsRunning(true)
      setRolls(prevState => prevState + 1)
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
    } else {
      setTenzies(false)
      setDice(allNewDice())
      setRolls(0)
      setTime(0)   
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
  }

  function newGame() {
    setIsRunning(false)
    setTenzies(false)
    setDice(allNewDice())
    setRolls(0)
    setTime(0)
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  function timer(time) {
    // Minutes calculation
    const minutes = Math.floor((time % 360000) / 6000)
    // Seconds calculation
    const seconds = Math.floor((time % 6000) / 100)
    // Milliseconds calculation
    const milliseconds = time % 100
    //formatted string representation of time
    const formattedTimer = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`
    
    return formattedTimer
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same as fast as you can.<br /><br />
        Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <div className="buttons">
        <button
          className="roll-dice"
          onClick={rollDice}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
        {!tenzies && <button
          className="new-game"
          onClick={newGame}
        >
          New Game
        </button>}
      </div>
      <div className="info">

        <div className="rolls">
          <p className="rolls-header">Number of rolls</p>
          <p className="rolls-count">{rolls}</p>
        </div>

        <div className="timer">
          <p className="timer-header">Timer</p>
          <p className="timer-count">{timer(time)}</p>
        </div>

        <div className="best-time">
          <p className="best-time-header">Best Time</p>
          <p className="best-time-count">{timer(bestTime)}</p>
        </div>
      </div>
      <footer>Made by José Miguel Carvajal Jiménez</footer>
    </main>
  )
}
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

  //useEffect to validate win condition
  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

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
    setTenzies(false)
    setDice(allNewDice())
    setRolls(0)
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

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
        {!tenzies &&<button
          className="new-game"
          onClick={newGame}
        >
          New Game
        </button>}
      </div>
      <div className="info-container">
        <div className="rolls">
          <p className="number-rolls">Number of rolls</p>
          <p className="number-rolls">{rolls}</p>
        </div>
        <div className="timer">
          <p className="timer-count">Timer</p>
          <p className="timer-count">00:00:00</p>
        </div>
      </div>
    </main>
  )
}
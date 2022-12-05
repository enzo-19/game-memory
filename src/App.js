import { useState, useEffect, useRef } from 'react'
import SingleCard from './components/SingleCard'

const cardImages = [
  {"src": "/img/dromedario.jpg"},
  {"src": "/img/tortuga.jpg"},
  {"src": "/img/medusa.jpg"},
  {"src": "/img/humano.jpg"},
  {"src": "/img/gallo.jpg"},
  {"src": "/img/cabras.jpg"},
  {"src": "/img/girafa.jpg"},
  {"src": "/img/cuervo.jpg"},
  {"src": "/img/flamengo.jpg"},
  {"src": "/img/caracol.jpg"}
]

const initialTime = 90

function App() {

  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [gameIsActive, setGameIsActive] = useState(false)
  const [gameIsReady, setGameIsReady] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  // TIMER
  const timerId = useRef(null)

  const startTimer = () => {
    if (timerId.current) return;
    timerId.current = setInterval(() => {
      setTimeLeft(prev => prev - 1)      
    }, 1000);
  }

  const stopTimer = () => {
    clearInterval(timerId.current)
    timerId.current = null
  }

  const resetTimer = () => {
    stopTimer()
    setTimeLeft(initialTime)
  }
  // FIN TIMER

  const  shuffleCards = () => {

    let array = [...cardImages, ...cardImages].map((card, index) => ({...card, id: index, matched: false}))

    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    setCards(array)
  }

  const startGame = () => {
    startTimer()
    setGameIsActive(true)
  }
  const endGame = () => {
    stopTimer()
    setGameIsActive(false)
    setGameIsReady(false)
  }

  const handleNewGame = () => {
    setCards(prevCards => prevCards.map(card => ({...card, matched: false})))
    setGameResult(null)
    setGameIsActive(false)
    resetTurn()
    resetTimer()
    setTimeout(() => {
      shuffleCards()
    }, choiceOne && 300 | 0); // 300 es el tiempo que tarda la tarjeta en girar
    setGameIsReady(true)
  }

  const handleChoice = (card) => {
    if (!gameIsReady || choiceTwo || card.matched) return

    if (!choiceOne) {
      if(!gameIsActive){
        startGame()
      }
      setChoiceOne(card)
    } else if (choiceOne.id !== card.id) {
      // la condición evita que eligamos la misma carta dos veces
      setChoiceTwo(card)
    }
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
  }

  // comprueba si las cartas coinciden
  useEffect(() => {
    if (!choiceTwo) return

    if (choiceOne.src === choiceTwo.src){
      setCards(prevCards => {
        return prevCards.map(card => card.src === choiceOne.src ? ({...card, matched: true}) : card)
      })
      resetTurn()
      
    } else {
      setTimeout(() => {
        resetTurn()
      }, 900);
    }

  }, [choiceTwo])

  // juego perdido por tiempo
  useEffect(() => {
    if(timeLeft === 0) {
      endGame()
      setGameResult('lose')
    }

  }, [timeLeft])

  // juego completado con éxito
  useEffect(() => {
    if (gameIsActive && cards.every(card => card.matched === true)) {
      setGameResult('win')
      endGame()
    }
  }, [cards, gameIsActive])

  useEffect(() => {
    shuffleCards()
    setGameIsReady(true)
  }, [])

  return (
    <div className="App">
      <div className="header">
        <button onClick={handleNewGame}>New Game</button>
    
        <div className={`time ${timeLeft < 16 ? 'red' : ''}`}>Time: {timeLeft}</div>
      </div>

      <div className='grid-container'>
        { gameResult === 'win' && <div className='cartel'>You win</div> }
        { gameResult === 'lose' && <div className='cartel'>You lose</div> }
       <div className={`card-grid ${gameResult ? 'dark' : ''}`}>
        {
          cards.map((card, index) => <SingleCard key={index} card={card} handleChoice={handleChoice} flipped={card === choiceOne || card === choiceTwo || card.matched}/>)
        }
       </div>
      </div>

    </div>
  );
}

export default App;

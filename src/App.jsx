import { useState } from 'react'
import {languages } from './languages'
import clsx from 'clsx'
import { getFarewellText, gameWord } from './utils'
import Confetti from 'react-confetti'

function App() {
  // state variables
  const [word, setWord] = useState(() => gameWord())
  const [guessLetters, setGuessLetters] = useState([])

  // derived variables
  const wrongGuessCount = guessLetters.filter((letter) => !word.includes(letter)).length
  const gameWin = word.split('').every((letter) => guessLetters.includes(letter));
  const gameLose = wrongGuessCount >= languages.length - 1
  const gameOver = gameWin || gameLose
  
  // static variables
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'



  function handleClick(letter) {
    if (!gameOver)
    {
      setGuessLetters(oldLetters => (
          oldLetters.includes(letter) ? oldLetters : [...oldLetters, letter])
        ) 
    }
  } 
  const lettersElements = word.split('').map((letter, index) => {
    const className = clsx(!guessLetters.includes(letter) && gameLose ? 'wrong-letters' : '')
    return (
      <span key={index} className={className}>
        {guessLetters.includes(letter) || gameLose ? letter.toUpperCase() : ''}
      </span>
    )
  })
  
  const languageElements =  languages.map((language, index) => {
    
    const isLangLost = index < wrongGuessCount
    const className = clsx(isLangLost &&'lost')
    
    const styles = {
      backgroundColor: language.backgroundColor, 
      color: language.color
    }

    return (
      <span key={language.name} className={className}  
      style={styles}>
        {language.name}
      </span>
    )
  })

  const keyboardElements = alphabet.split('').map((letter) => {
    const isGuessed = guessLetters.includes(letter)
    const isCorrect = isGuessed && word.includes(letter)
    const isWrong =  isGuessed && !word.includes(letter)
    const className = clsx({
      'correct': isCorrect,
      'wrong': isWrong
    })

    return (
      <button 
        className={className}
        key={letter}
        onClick={() => handleClick(letter)}
        disabled={gameOver}
        aria-label={letter}
        >
        {letter.toUpperCase()}
      </button>
    )
  })


  const className = clsx('game-status',{
                                        'wrong-guess': !gameOver && wrongGuessCount > 0 && !word.includes(guessLetters[guessLetters.length - 1]),
                                        'game-over': gameLose, 
                                        'win': gameWin
                                      }
                        )
  
  function renderStats() {
    if (!gameOver && wrongGuessCount > 0)
      return (
          !word.includes(guessLetters[guessLetters.length - 1]) &&
        <p>
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    else if (gameLose)
      return (
        <>
          <h2>Game Over</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    else if (gameWin)
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    
  }

  return (
    <main>
      {
        gameWin && 
        <Confetti 
          recycle={false}
          numberOfPieces={1000}
        />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
            Guess the word in under 8 attempts to keep the programming world safe from Assembly!
        </p>
        <div className={className} aria-live='polite' role='status'>
          {renderStats()}
        </div>
      </header>
      <section className='game-elimination'>
      {languageElements}
      </section>

      <section className='word'>
      {lettersElements}
      </section>

      <section className='keyboard'>
      {keyboardElements}
      </section>
      {
        gameOver &&
        <button className="new-game" 
        onClick={() => {
          setGuessLetters([]) 
          setWord(gameWord)}
          }
          >
          New Game
        </button>
      }
    </main>
  )
}

export default App

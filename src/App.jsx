import { useState } from 'react'
import {languages } from './languages'
import clsx from 'clsx'

function App() {
  // state variables
  const [word, setWord] = useState('react')
  const [guessLetters, setGuessLetters] = useState([])

  // derived variables
  const wrongGuessCount = guessLetters.filter((letter) => !word.includes(letter)).length
  // static variables
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const gameWin = word.split('').every((letter) => guessLetters.includes(letter));
  const gameLose = wrongGuessCount >= languages.length - 1
  const gameOver = gameWin || gameLose


  const gameStatus = [] ;
  
  function handleClick(letter) {
    if (!gameOver)
    {
      setGuessLetters(oldLetters => (
          oldLetters.includes(letter) ? oldLetters : [...oldLetters, letter])
        ) 
    }
  } 
  const lettersElements = word.split('').map((letter, index) => {
    return (
      <span key={index}>
        {guessLetters.includes(letter) || wrongGuessCount === 8 ? letter.toUpperCase() : ''}
      </span>
    )
  })
  
  const languageElements =  languages.map((language, index) => {
    
    const isLost = index < wrongGuessCount
    const className = clsx(isLost &&'lost')
    
    const styles = {
      backgroundColor: language.backgroundColor, 
      color: language.color}
    
    index < wrongGuessCount  && gameStatus.push(language.name)

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
      <button className={className} key={letter} onClick={() => handleClick(letter)}>
        {letter.toUpperCase()}
      </button>
    )
  })


  const className = clsx('game-status',{
                                        'wrong-guess': !gameOver && wrongGuessCount > 0,
                                        'game-over': gameLose, 
                                        'win': gameWin
                                      }
                        )
  
  
  function renderStats() {
    if (!gameOver && wrongGuessCount > 0)
      return (
        <p>
          {`“Farewell ${gameStatus.join(" & ")}“🫡`}
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
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
            Guess the word in under 8 attempts to keep the programming world safe from Assembly!
        </p>
        <div className={className}>
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
        <button className="new-game" onClick={() => setGuessLetters([]) }>New Game</button>
      }
    </main>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import words from '../../assets/words'


const TextField = () => {
  const [quote, setQuote] = useState("Click start when your ready...")
  const [wordInput, setWordInput] = useState('')
  let quoteArr = quote.split(' ')
  var [errors, setErrors] = useState(0);
  var [wordsCompleted, setWordsCompleted] = useState(0);
  var [timeLeft, setTimeLeft] = useState(30);

  const printWords = (quoteDiv) => {

    if (typeof quoteDiv === 'object') {
      //checking if there is something in the quote div and if there is we are going to change it to the new one
      if (quoteDiv.children?.length > 1) {
        while (quoteDiv.lastChild) {
          quoteDiv.removeChild(quoteDiv.lastChild);
        }
      }
      //loop through the words array to create div for each word
      quoteArr.forEach((word) => {
        let child = document.createElement('div')
        let letters = word.split('')
        child.className = 'pr-6 flex text-gray-500 font-mono'
        //same for each word to get the letter
        letters.forEach((char) => {
          let letter = document.createElement('p')
          letter.textContent = char
          letter.className = ""
          child.appendChild(letter)
        })
        quoteDiv.appendChild(child)
      })
    }
    quoteDiv.scrollIntoView();
  }

  const startGame = () => {
    const wordIn = document.getElementById("wordInput")

    wordIn.disabled = false
    wordIn.value = ""
    wordIn.focus()
    randomQuote(words)
    setErrors(0)
    setWordsCompleted(0)
    startTimer(30)
    printWords(quote)
  }

  function startTimer(number) {
    setTimeLeft(number)
    let counter = setInterval(() => setTimeLeft((prev) => {
      if (prev <= 0) {
        const wordIn = document.getElementById("wordInput")
        const restartBtn = document.getElementById("startBtn")
        restartBtn.disabled = false
        wordIn.disabled = true
        clearInterval(counter)
        return 0;
      }
      prev--
      return prev
    }), 1000);

  }

  const checkErrors = () => {
    //grab the words to check from div element
    let [wordsToCheck] = document.querySelectorAll(`#words`);
    if (wordInput.length > 0) {
      var index = wordInput.length - 1;
      setWordsCompleted(index) //set words completed to index which would be length - 1
      let letterIndex = wordInput[index].split('').length - 1;
      let currentWordToCheckDiv = wordsToCheck.children[index]
      currentWordToCheckDiv.scrollIntoView();
      //check if we have gone over the letter limit for the current word to check
      if (letterIndex <= currentWordToCheckDiv.children.length - 1) {
        let currentLetterToCheckDiv = currentWordToCheckDiv.children[letterIndex]
        if (wordInput[index][letterIndex] === currentLetterToCheckDiv.innerHTML) {
          currentLetterToCheckDiv.classList.add('text-neutral-200')
        }
        else {
          currentLetterToCheckDiv.classList.add('text-red-600')
          setErrors((prev) => prev + 1)
        }
      } else {
        //if we go over the letter limit we will add the letter to the end of that word as an error
        const errorLetter = document.createElement('div')
        errorLetter.innerText = wordInput[index][letterIndex]
        errorLetter.classList = "text-red-600"
        currentWordToCheckDiv.appendChild(errorLetter)
        setErrors(prev => prev + 1)
      }
    } else {
      const wordInput = document.getElementById("wordInput")
      wordInput.value = ''
      wordInput.disabled = true
    }
  }

  const handleChange = (e) => {
    let inputArr = e.target.value.split(' ')
    setWordInput(inputArr.filter((ele) => ele !== ''))
  }

  const randomQuote = (words) => {
    let someQuote = []
    for (let i = 0; i < 100; i++) {
      someQuote.push(words[Math.floor(Math.random() * words.length - 1)])
    }
    setQuote(someQuote.join(" ").toLocaleLowerCase())
  }

  const handleStart = (e) => {
    e.target.disabled = true
    e.target.innerText = "Restart"
    startGame()

  }

  useEffect(() => {
    const quoteDiv = document.getElementById("words")
    printWords(quoteDiv)

  }, [quote])

  useEffect(() => {
    checkErrors()

  }, [wordInput])

  return (
    <div id="window" className='w-full flex flex-col bg-neutral-900'>
      <div id='info' className='w-full flex justify-center'>
        <div id='time' className='text-gray-200 3 w-fit p-2'>Time: {timeLeft}</div>
        <div id='errors' className='text-gray-200 w-fit p-2'>Errors: {errors}</div>
        <div id='wordCount' className='text-gray-200 w-fit p-2'>Words: {wordsCompleted}</div>
      </div>
      <div id="gameWrapper" onClick={() => document.getElementById("wordInput").focus()}
        className='
          bg-neutral-900
          w-full
          h-64 
          flex
          overflow-y-hidden
          '>
        <div id="words"
          className="
            flex 
          flex-wrap 
          bg-transparent 
            text-5xl
            w-full 
            h-fit
            pl-2
            pr-2
            font-semibold
            font-serif
            "></div>

        <input id="wordInput"
          onChange={handleChange}
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          data-gramm="false"
          data-gramm-editor='false'
          data-enable-grammarly="false"
          className="cursor-default decoration-transparent text-transparent bg-transparent absolute z-10 outline-none"
          list="autocompleteOff"

        />

      </div>
      <div id='buttons' className='flex justify-center'>
        <button
          id="startBtn"
          className='
        text-black 
        bg-orange-400
        w-24
        rounded
        h-10
        font-mono
        m-3
        disabled:opacity-50
        '
          onClick={handleStart}>Start</button>
      </div>
    </div>
  )
}

export default TextField
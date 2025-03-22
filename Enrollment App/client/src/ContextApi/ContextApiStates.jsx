import CreateContextApi from './CreateContextApi'
import React, { useState, useEffect } from 'react'
import questions from '../assets/questions'

export default function ContextApiStates(props) {
  const [currentPensionerData, setCurrentPensionerData] = useState({});
  const [audio, setAudio] = useState(null);
  const [adminInfo, setAdminInfo] = useState({})
  const [operatorInfo, setOperatorInfo] = useState({})
  const [sound, setSound] = useState();
  const [startVerify, setStartVerify] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [previousNumbers, setPreviousNumbers] = useState(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('role'));

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Function to generate an array of five unique random numbers
  function generateUniqueRandomNumbers(min, max, existingNumbers) {
    const randomNumbers = new Set();

    while (randomNumbers.size < 5) {
      const number = getRandomInt(min, max);
      if (!existingNumbers.has(number)) {
        randomNumbers.add(number);
      }
    }

    return Array.from(randomNumbers);
  }
  const getRandomNumbers = () => {
    // const min = 1; // Minimum value (inclusive)
    // const max = questions.length - 1; // Maximum value (exclusive)

    // const newNumbers = generateUniqueRandomNumbers(min, max, previousNumbers);
    // setPreviousNumbers(new Set([...previousNumbers, ...newNumbers]));
    // setPreviousNumbers(new Set())
    // setRandomQuestions([]);
    // setQuestions(newNumbers)
  }
  const setQuestions = () => {
    setRandomQuestions(() => {
      // Create a new array with exactly 6 elements (5 from questions[0], 1 from questions[1])
      return [
        ...Array(5).fill({
          text: questions[0].text,
          file: questions[0].file
        }),
        {
          text: questions[1].text,
          file: questions[1].file
        }
      ];
    });
  };
  useEffect(() => {
    console.log(randomQuestions);
  }, [randomQuestions])
  const playSound = (file) => {
    if (audio) {
      // Stop any currently playing audio before starting a new one
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(file);
    setAudio(newAudio);

    newAudio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  useEffect(() => {
    return () => {
      if (audio) {
        console.log('Unloading Sound');
        audio.pause();
        audio.src = '';  // Release the audio resource
      }
    };
  }, [audio]);

  return (
    <>
      <CreateContextApi.Provider value={{
        isAuthenticated, setIsAuthenticated,
        currentPensionerData, setCurrentPensionerData,
        adminInfo, setAdminInfo, operatorInfo, setOperatorInfo
        , playSound, randomQuestions, startVerify, setStartVerify, setQuestions
      }}>
        {props.children}
      </CreateContextApi.Provider>
    </>
  )
}

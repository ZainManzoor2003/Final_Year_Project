import React, { useEffect, useState } from 'react'
import CreateContextApi from './CreateContextApi'
import { Audio } from 'expo-av';
import getQuestions from '../assets/questions';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';
import questions2 from '../assets/questions2';
import questions3 from '../assets/questions3';


export default function ContextApiStates(props) {
    const [currentUser, setCurrentUser] = useState({
        _id: '',
        name: '',
        username: '',
        password: '',
        cnic: '',
        number: '',
        address: '',
        pensionBank: '',
        city: '',
        age: 'اٹھارہ',
        totalSessions: 0
    });
    const questions = getQuestions(currentUser.name, currentUser.age, currentUser.city, currentUser.cnic,currentUser.pensionBank);
    const [ipAddress, setIpAddress] = useState('');
    const [sound, setSound] = useState();
    const [startVerify, setStartVerify] = useState(false);
    const [randomQuestions, setRandomQuestions] = useState([]);

    const [previousNumbers, setPreviousNumbers] = useState(new Set());

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Function to generate an array of five unique random numbers
    function generateUniqueRandomNumbers(min, max, limit, existingNumbers) {
        const randomNumbers = new Set();

        while (randomNumbers.size < limit) {
            const number = getRandomInt(min, max);
            if (!existingNumbers.has(number)) {
                randomNumbers.add(number);
            }
        }

        return Array.from(randomNumbers);
    }
    const getRandomNumbers = () => {
        const min = 1; // Minimum value (inclusive)
        const max = questions.length; // Maximum value (exclusive)

        const newNumbers = generateUniqueRandomNumbers(min, max, 5, previousNumbers);
        setPreviousNumbers(new Set([...previousNumbers, ...newNumbers]));
        setPreviousNumbers(new Set());
        newNumbers.map(number => {
            setRandomQuestions((pre) => [...pre,
            {
                text: questions[number].text,
                file: questions[number].file,
                possibleAnswer: questions[number].possibleAnswer
            }])
        })
    }
    const getRandomNumbersForFaces = () => {
        const min = 0; // Minimum value (inclusive)
        const max = questions2.length; // Maximum value (exclusive)

        const newNumbers = generateUniqueRandomNumbers(min, max, 2, previousNumbers);
        setPreviousNumbers(new Set([...previousNumbers, ...newNumbers]));
        setPreviousNumbers(new Set())
        setRandomQuestions([]);
        newNumbers.map(number => {
            setRandomQuestions((pre) => [...pre,
            {
                text: questions2[number].text,
                file: questions2[number].file,
                value: questions[number].file
            }])
        })
    }
    const getRandomNumbersForSpecificLine = () => {
        const number = Math.floor(Math.random() * (4 - 0)) + 0;
        const tempNumbers = [number, 5, 6]
        tempNumbers.map(number => {
            setRandomQuestions((pre) => [...pre,
            {
                text: questions3[number].text,
                file: questions3[number].file,
                possibleAnswer: questions3[number].possibleAnswer
            }])
        })

    }
    const setQuestions = (newNumbers) => {
        newNumbers.map(number => {
            setRandomQuestions((pre) => [...pre,
            {
                text: questions[number].text,
                file: questions[number].file
            }])
        })

    }
    useEffect(() => {
        console.log(randomQuestions);
    }, [randomQuestions])
    const playSound = async (file) => {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(file);
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }
    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    // useEffect(() => {
    //     const fetchIpAddress = async () => {
    //         const ipAddress = await Network.getIpAddressAsync();
    //         console.log(ipAddress);
    //     }
    //     fetchIpAddress()

    //     // Listen for network changes
    //     const unsubscribe = NetInfo.addEventListener(state => {
    //         if (state.isConnected && (state.type === 'wifi' || state.type === 'cellular')) {
    //             fetchIpAddress(); // Re-fetch the IP address when connected to Wi-Fi
    //         }
    //     });

    //     // Cleanup the listener on unmount
    //     return () => unsubscribe();

    // }, []);

    return (
        <CreateContextApi.Provider value={{
            playSound, getRandomNumbers, randomQuestions, startVerify, setStartVerify,
            currentUser, setCurrentUser, ipAddress, setIpAddress, getRandomNumbersForFaces, getRandomNumbersForSpecificLine,
        }}>
            {props.children}
        </CreateContextApi.Provider>
    )
}
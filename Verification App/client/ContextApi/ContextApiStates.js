import React, { useEffect, useState } from 'react'
import CreateContextApi from './CreateContextApi'
import { Audio } from 'expo-av';
import questions from '../assets/questions'
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';


export default function ContextApiStates(props) {
    const [ipAddress, setIpAddress] = useState('');
    const [sound, setSound] = useState();
    const [startVerify, setStartVerify] = useState(false);
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        name: '',
        cnic: '',
        totalSessions: 0
    });
    const [previousNumbers, setPreviousNumbers] = useState(new Set());

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
        const min = 1; // Minimum value (inclusive)
        const max = questions.length - 1; // Maximum value (exclusive)

        const newNumbers = generateUniqueRandomNumbers(min, max, previousNumbers);
        setPreviousNumbers(new Set([...previousNumbers, ...newNumbers]));
        setPreviousNumbers(new Set())
        setRandomQuestions([]);
        setQuestions(newNumbers)
    }
    const setQuestions = (newNumbers) => {
        newNumbers.map(number => {
            setRandomQuestions((pre) => [...pre,
            {
                text: questions[number].text,
                file: questions[number].file
            }])
        })
        // console.log(newNumbers);

    }
    // useEffect(() => {
    //     console.log(randomNumbers);
    // }, [randomNumbers])
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
            currentUser, setCurrentUser, ipAddress, setIpAddress
        }}>
            {props.children}
        </CreateContextApi.Provider>
    )
}
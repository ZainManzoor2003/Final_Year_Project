import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
    Box,
    IconButton, Button, TextField,
    Card
}
    from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EmergencyRecordingIcon from '@mui/icons-material/EmergencyRecording';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Switch from '@mui/material/Switch';
import CreateContextApi from '../../ContextApi/CreateContextApi';
import './ManagePensioners.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc'

const label = { inputProps: { 'aria-label': 'Switch demo' } };


const UpdateModal = ({ show, onClose, pensioner }) => {

    const [currentOperator, setCurrentOperator] = useState({});

    useEffect(() => {
        if (pensioner) {
            setCurrentOperator({
                _id: pensioner._id,
                name: pensioner.name,
                urduName: pensioner.urduName,
                password: pensioner.password,
                number: pensioner.number,
                address: pensioner.address,
                pensionBank: pensioner.pensionBank,
                city: pensioner.city,
                urduPensionBank: pensioner.urduPensionBank,
                urduCity: pensioner.urduCity,
                email: pensioner.email,
                cnic: pensioner.cnic

            });
        }
    }, [pensioner])

    if (!show) return null;

    const validateFields = () => {
        const { name, password, number, address, pensionBank, city, urduName, urduCity, urduPensionBank } = currentOperator;

        if (!name) {
            alert("Name is required.");
            return false;
        }
        if (!/[A-Za-z]/.test(name)) {
            alert("Only Spaces are not allowed.");
            return false;

        }
        if (!number) {
            alert("Number is required.");
            return false;
        }
        if (number.length < 11) {
            alert("Number must be 11 digits.");
            return false;
        }
        if (!address) {
            alert("Address is required.");
            return false;
        }
        if (!/[A-Za-z]/.test(address)) {
            alert("Only Spaces are not allowed.");
            return false;

        }
        if (!password) {
            alert("Password is required.");
            return false;
        }
        if (!pensionBank) {
            alert("Pension Bank is required.");
            return false;
        }
        if (!city) {
            alert("City is required.");
            return false;
        }
        if (!urduName) {
            alert("Urdu Name is required.");
            return false;
        }
        if (!urduPensionBank) {
            alert("Urdu Pension Bank is required.");
            return false;
        }
        if (!urduCity) {
            alert("Urdu City is required.");
            return false;
        }
        if (password.length < 8 || password.length > 13) {
            alert("Password must be between 8 to 13  characters.");
            return false;
        }

        // Check if password contains only allowed characters and no whitespace
        if (!/^[a-z0-9@_]+$/.test(password)) {
            alert("Password should contain only lowercase letters, digits, '@', '_', and no whitespace.");
            return false;
        }


        return true;
    };


    const handleSubmit = async () => {
        if (!validateFields()) return;
        try {
            await axios.post(`https://fyp-enrollment-server.vercel.app/updatePensioner`, currentOperator)
                .then((res) => {
                    alert(res.data.message);
                    onClose()
                })

        } catch (err) {
            alert(err.message)
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal-content">
                    <span className="close-icon" onClick={onClose}>&times;</span>
                    <h2>Update Pensioner</h2>
                    <label>Name:*</label>
                    <input
                        type="text"
                        value={currentOperator.name}
                        onChange={(e) => {
                            const name = e.target.value.replace(/[^A-Za-z\s]/g, "");
                            setCurrentOperator(prev => ({ ...prev, name: name }))
                        }}
                        maxLength={30}
                    />
                    <label className='urduLabel'>*:نام</label>
                    <input
                        type="text"
                        value={currentOperator.urduName || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^ا-ی\s]/g, "");
                            setCurrentOperator(pre => ({ ...pre, urduName: value }))
                        }}
                        maxLength={30}
                        className='urduInput'
                    />
                    <label>Password:*</label>
                    <input
                        type="password"
                        value={currentOperator.password}
                        onChange={(e) => setCurrentOperator(prev => ({ ...prev, password: e.target.value }))}
                        maxLength={13}
                    />
                    <label>City:*</label>
                    <select
                        value={currentOperator.city}
                        onChange={(e) => setCurrentOperator(prev => ({ ...prev, city: e.target.value }))}
                    >
                        <option value="">Select a City</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                    <label className='urduLabel'>*:شہر</label>
                    <select
                        value={currentOperator.urduCity}
                        onChange={(e) => setCurrentOperator(prev => ({ ...prev, urduCity: e.target.value }))}
                        style={{ textAlign: 'right' }}

                    >
                        <option value="">شہر منتخب کریں</option>
                        {citiesUrdu.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                    <label>Pension Bank:*</label>
                    <select
                        value={currentOperator.pensionBank}
                        onChange={(e) => setCurrentOperator(prev => ({ ...prev, pensionBank: e.target.value }))}
                    >
                        <option value="">Select a Bank</option>
                        {pakistanBanksEnglish.map((bank, index) => (
                            <option key={index} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                    <label className='urduLabel'>*:پنشن بینک</label>
                    <select
                        value={currentOperator.urduPensionBank}
                        onChange={(e) => setCurrentOperator(prev => ({ ...prev, urduPensionBank: e.target.value }))}
                        style={{ textAlign: 'right' }}

                    >
                        <option value="">بینک منتخب کریں</option>
                        {pakistanBanksUrdu.map((bank, index) => (
                            <option key={index} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                    <label>Contact Number:*</label>
                    <input
                        type="text"
                        value={currentOperator.number}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setCurrentOperator(prev => ({ ...prev, number: value }))
                        }}
                        maxLength={11}
                    />
                    <label>Address:*</label>
                    <input
                        type="text"
                        value={currentOperator.address}
                        onChange={(e) => setCurrentOperator(prev => ({ ...prev, address: e.target.value }))}
                        maxLength={70}
                    />
                    <label>CNIC:</label>
                    <input
                        type="text"
                        value={currentOperator.cnic}
                        disabled
                    />
                    <label>Email:</label>
                    <input
                        type="text"
                        value={currentOperator.email}
                        disabled
                    />
                    <button onClick={handleSubmit}>Update</button>
                </div>
            </div>
        </div>
    );
};

const CountDownTimer = ({ isRecording, seconds, setSeconds }) => {
    useEffect(() => {
        if (!isRecording) return; // Stop if not recording

        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval); // Clear interval on cleanup
    }, [isRecording, setSeconds]);

    return (
        <div>
            <h5 style={{ color: seconds >= 60 ? 'red' : 'black' }}>Time: {seconds} seconds</h5>
        </div>
    );
};

const Verification = ({ show, onClose }) => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null)
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [videoFiles, setVideoFiles] = useState([]);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [cameraDisabled, setCameraDisabled] = useState(false);
    const [videoUploaded, setVideoUploaded] = useState(false)
    const [videoRecorded, setVideoRecorded] = useState(false)
    const [submit, setSubmit] = useState(null);
    const [recordingDisabled, setRecordingDisabled] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [question, setQuestion] = useState('انتظار فرمائیں');
    const [dots, setDots] = useState('.');
    const [timer, setTimer] = useState('ریکارڈنگ کا عمل شروع کریں');
    const [index, setIndex] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const { setQuestions, randomQuestions, playSound, startVerify, setStartVerify,
        currentPensionerData } = useContext(CreateContextApi);



    useEffect(() => {
        if (timer !== 'ریکارڈنگ کا عمل شروع کریں') {
            const countdown = setTimeout(() => {
                if (timer > 1) setTimer(timer - 1);
                else {
                    clearTimeout(countdown);
                    setStartVerify(true);
                    setTimer('ریکارڈنگ کا عمل شروع کریں');
                }
            }, 1000);
        }
    }, [timer]);

    useEffect(() => {
        const takeScreenshots = async () => {
            const formData = new FormData();
            const lastIndex = videoFiles.length - 1;

            formData.append('videos', videoFiles[lastIndex], `${currentPensionerData.cnic}_${lastIndex + 1}.mp4`);

            try {
                const response = await axios.post('http://localhost:5001/extract_images', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Videos uploaded successfully:', response.data);
                toast.success(`Pensioner Enrolled Successfully`, {
                    position: 'top-center',
                    autoClose: 3000
                })
            } catch (error) {
                console.error('Error uploading videos:', error);
            }
            setIndex(0)
        }
        videoFiles.length == 6 && takeScreenshots()

    }, [videoFiles])
    useEffect(() => {

        if (videoUploaded) {
            setIndex(index + 1);
            if (index === 5) {
                setVideoUploaded(false);
                // setCameraDisabled(true);
                onClose()
                // setSubmit(true);
            }
        }
    }, [videoUploaded]);

    useEffect(() => {
        const updateDots = setInterval(() => {
            setDots((prevDots) => (prevDots === '...' ? '.' : prevDots + '.'));
        }, 1000);
        return () => clearInterval(updateDots);
    }, []);

    useEffect(() => {
        setQuestions()
    }, []);

    useEffect(() => {
        const changeQuestion = async () => {
            // console.log('change question', index);

            if (randomQuestions.length > 0 && index <= 5 && startVerify) {
                setRecordingDisabled(true);
                await playSound(randomQuestions[index].file);
                setQuestion(randomQuestions[index].text);
                setTimeout(() => {
                    setRecordingDisabled(false);
                }, 3000);
            }
        };
        changeQuestion();
    }, [index, startVerify]);

    const handleDataAvailable = useCallback(({ data }) => {
        {
            if (data.size > 0) {
                console.log('on data available');

                setRecordedChunks((pre) => pre.concat(data))
            }
        }
    }, [setRecordedChunks])

    const handleStartCaptureClick = useCallback(() => {
        setIsRecording(true)
        setVideoRecorded(false)
        mediaRecorderRef.current = RecordRTC(webcamRef.current.stream, {
            type: "video/mp4",
            mimeType: 'video/mp4'
        })
        mediaRecorderRef.current.startRecording()
        mediaRecorderRef.current.ondataavailable = handleDataAvailable
    }, [webcamRef, setIsRecording, mediaRecorderRef, handleDataAvailable])

    const handleStopCaptureClick = useCallback(() => {
        setIsRecording(false)
        setSeconds(0)
        mediaRecorderRef.current.stopRecording(() => {
            const blobs = mediaRecorderRef.current.getBlob()
            setRecordedChunks([blobs])
        })
        setVideoRecorded(true)
    }, [setIsRecording, mediaRecorderRef])

    // const handlePause = useCallback(() => {
    //     mediaRecorderRef.current.stopRecording(() => {
    //         const newBlob = mediaRecorderRef.current.getBlob()
    //         setRecordedChunks((prevChunks) => [...prevChunks, newBlob]);
    //     })
    //     setIsPaused(true);
    // }, [mediaRecorderRef])


    // const handleResume = useCallback(() => {
    //     mediaRecorderRef.current = RecordRTC(webcamRef.current.stream, {
    //         type: "video/mp4",
    //         mimeType: 'video/mp4'
    //     })
    //     mediaRecorderRef.current.startRecording()
    //     mediaRecorderRef.current.ondataavailable = handleDataAvailable // Resume recording
    //     setIsPaused(false);
    // }, [mediaRecorderRef, webcamRef, handleDataAvailable])

    useEffect(() => {
        const saveVideo = () => {
            setQuestion('انتظار فرمائیں');
            setVideoUploaded(false);
            setTimeout(async () => {
                if (recordedChunks.length) {
                    const blob = new Blob(recordedChunks, {
                        type: "video/mp4"
                    })
                    setVideoFiles(prev => [...prev, blob]);
                    const formData = new FormData();
                    formData.append("video", blob, `${currentPensionerData.cnic}` + '_' + `${index + 1}` + '.mp4');

                    try {
                        const response = await axios.post("https://fyp-enrollment-server.vercel.app/upload", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        });
                        console.log("Video uploaded successfully:", response.data);
                        setVideoUploaded(true)
                    } catch (error) {
                        console.error("Error uploading video:", error);
                    }
                }
            }, 2000);

        }

        saveVideo()

    }, [recordedChunks])

    useEffect(() => {
        const convertToWav = async () => {
            const formData = new FormData();

            // Append each video blob to FormData
            videoFiles.forEach((blob, index) => {
                formData.append('files', blob, `${currentPensionerData.cnic}` + '_' + `${index + 1}` + '.mp4');
            });
            try {
                let response = await axios.post('http://localhost:5001/convert', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'json'
                });
            } catch (error) {
                Alert.alert('Error uploading mp4 file to convert it into wav', error.message);
            }
        }
        videoFiles.length == 5 && convertToWav()
    }, [videoFiles])


    const saveVideo = async () => {
        setQuestion('انتظار فرمائیں');
        setVideoUploaded(false);
        // Upload logic here if needed
        setVideoUploaded(true);
    };
    if (!show) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h2>Record Videos</h2>
                {isRecording && <CountDownTimer isRecording={isRecording} seconds={seconds} setSeconds={setSeconds} />}
                <div style={styles.container}>
                    {startVerify ? (
                        <>
                            <div style={styles.questionContainer}>
                                <h2 style={{ fontWeight: "700", fontSize: '1.5rem' }}>{question === 'انتظار فرمائیں' ? dots + question : question}</h2>
                            </div>
                            <div style={styles.videoContainer}>
                                <Webcam
                                    ref={webcamRef}
                                    audio={true}
                                    mirrored={true}
                                    videoConstraints={{ width: 480, height: 360 }}
                                />
                            </div>
                            <div style={styles.buttonContainer}>
                                {!isRecording ?
                                    <button style={styles.button} disabled={recordingDisabled} onClick={handleStartCaptureClick}>
                                        Start Recording
                                    </button>
                                    :
                                    <>
                                        {/* {isPaused ? <button style={styles.button} onClick={handleResume}>Resume Recording</button>
                                            : <button style={styles.button} onClick={handlePause}>Pause Recording</button>} */}
                                        <button disabled={seconds <= 2} style={styles.button} onClick={handleStopCaptureClick}>
                                            Stop Recording
                                        </button>
                                    </>
                                }
                            </div>
                        </>
                    ) : (
                        <button style={styles.button} onClick={() => setTimer(3)}>
                            {timer}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const AddModal = ({ show, onClose, updateVerify }) => {
    const { currentPensionerData, setCurrentPensionerData } = useContext(CreateContextApi);

    const [currentPensioner, setCurrentPensioner] = useState({ enable: true });

    const generatePassword = () => {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789@_";
        let password = "";
        const passwordLength = 8;

        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }

        setCurrentPensioner(prev => ({ ...prev, password }));
    };

    useEffect(() => {
        generatePassword();
    }, []);

    if (!show) return null;



    const handleNameChange = (e) => {
        const name = e.target.value.replace(/[^A-Za-z\s]/g, "");
        setCurrentPensioner(prev => ({ ...prev, name }));
    };

    // Validation function
    const validateFields = () => {
        const { name, cnic, email, number, address, dob, pensionBank, city, urduName, urduCity, urduPensionBank } = currentPensioner;

        if (!name) {
            alert("Name is required.");
            return false;
        }
        if (!/[A-Za-z]/.test(name)) {
            alert("Only Spaces are not allowed.");
            return false;

        }
        if (!cnic) {
            alert("CNIC is required.");
            return false;
        }
        if (cnic.length < 13) {
            alert("CNIC must be 13 digits.");
            return false;
        }
        if (!email) {
            alert("Email is required.");
            return false;
        }
        if (!number) {
            alert("Number is required.");
            return false;
        }
        if (number.length < 11) {
            alert("Number must be 11 digits.");
            return false;
        }
        if (!address) {
            alert("Address is required.");
            return false;
        }
        if (!dob) {
            alert("Date of Birth is required.");
            return false;
        }
        if (!pensionBank) {
            alert("Pension Bank is required.");
            return false;
        }
        if (!city) {
            alert("City is required.");
            return false;
        }
        if (!urduName) {
            alert("Urdu Name is required.");
            return false;
        }
        if (!urduPensionBank) {
            alert("Urdu Pension Bank is required.");
            return false;
        }
        if (!urduCity) {
            alert("Urdu City is required.");
            return false;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            alert("Invalid email format.");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        try {
            const response = await axios.post(`https://fyp-enrollment-server.vercel.app/addPensioner`, currentPensioner);
            alert(response.data.mes);
            onClose();

            if (response.data.mes === 'Pensioner Registered Successfully and Password Sent') {
                updateVerify();
            }
        } catch (error) {
            alert(error.message);
        }
    };



    return (
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal-content">
                    <span className="close-icon" onClick={onClose}>&times;</span>
                    <h2>Add Pensioner</h2>
                    <label>Name:*</label>
                    <input
                        type="text"
                        value={currentPensioner.name || ''}
                        onChange={handleNameChange}
                        maxLength={30}
                    />
                    <label className='urduLabel'>*:نام</label>
                    <input
                        type="text"
                        value={currentPensioner.urduName || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^ا-ی\s]/g, "");
                            setCurrentPensioner(pre => ({ ...pre, urduName: value }))
                        }}
                        maxLength={30}
                        className='urduInput'
                    />


                    <label>CNIC:*</label>
                    <input
                        type="text"
                        value={currentPensioner.cnic || ''}
                        maxLength={13}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setCurrentPensioner(prev => ({ ...prev, cnic: value }));
                            setCurrentPensionerData({ cnic: value });
                        }}
                    />
                    <label>City:*</label>
                    <select
                        value={currentPensioner.city || ''}
                        onChange={(e) => setCurrentPensioner(prev => ({ ...prev, city: e.target.value }))}
                    >
                        <option value="">Select a City</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                    <label className='urduLabel'>*:شہر</label>
                    <select
                        value={currentPensioner.urduCity || ''}
                        onChange={(e) => setCurrentPensioner(prev => ({ ...prev, urduCity: e.target.value }))}
                        style={{ textAlign: 'right' }}

                    >
                        <option value="">شہر منتخب کریں</option>
                        {citiesUrdu.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    <label>Email:*</label>
                    <input
                        type="text"
                        value={currentPensioner.email || ''}
                        onChange={(e) => setCurrentPensioner(prev => ({ ...prev, email: e.target.value }))}
                        maxLength={40}
                    />

                    <label>Contact Number:*</label>
                    <input
                        type="text"
                        value={currentPensioner.number || ''}
                        maxLength={11}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setCurrentPensioner(prev => ({ ...prev, number: value }))
                        }}
                    />

                    <label>Address:*</label>
                    <input
                        type="text"
                        value={currentPensioner.address || ''}
                        maxLength={70}
                        onChange={(e) => setCurrentPensioner(prev => ({ ...prev, address: e.target.value }))}
                    />
                    <label>Pension Bank:*</label>
                    <select
                        value={currentPensioner.pensionBank || ''}
                        onChange={(e) => setCurrentPensioner(prev => ({ ...prev, pensionBank: e.target.value }))}
                    >
                        <option value="">Select a Bank</option>
                        {pakistanBanksEnglish.map((bank, index) => (
                            <option key={index} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                    <label className='urduLabel'>*:پنشن بینک</label>
                    <select
                        value={currentPensioner.urduPensionBank || ''}
                        onChange={(e) => setCurrentPensioner(prev => ({ ...prev, urduPensionBank: e.target.value }))}
                        style={{ textAlign: 'right' }}

                    >
                        <option value="">بینک منتخب کریں</option>
                        {pakistanBanksUrdu.map((bank, index) => (
                            <option key={index} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                    <label>Date of Birth:*</label>
                    <input
                        type="date"
                        value={currentPensioner.dob || ''}
                        max={new Date().toISOString().split('T')[0]} // Set max date to today
                        onChange={(e) => setCurrentPensioner(prev => ({ ...prev, dob: e.target.value }))}
                    />

                    <button onClick={handleSubmit}>Add</button>
                </div>
            </div>
        </div>
    );
};



export default function ManagePensioners() {
    const { setCurrentPensionerData } = useContext(CreateContextApi);
    const [allPensioners, setAllPensioners] = useState([]);
    const [tempAllPensioner, setTempAllPensioners] = useState([]);
    const [filterText, setFilterText] = useState("")
    const [searchCity, setSearchCity] = useState("")
    const [page, setPage] = useState(0);  // Current page index
    const [rowsPerPage, setRowsPerPage] = useState(5);  // Number of rows per page
    const { id } = useParams();
    const navigate = useNavigate();
    const [isToggled, setIsToggled] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [pensioner, setPensioner] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const { adminInfo, setAdminInfo } = useContext(CreateContextApi)

    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                // Check if the authToken is available (from cookies or local storage)
                const response = await axios.get('https://fyp-enrollment-server.vercel.app/verify-token', {
                    withCredentials: true,
                });

                if (response.data.isAuthenticated) {
                    
                    if (response.data.role === 'admin') {
                        // If the token is valid, redirect the user
                        navigate(`/manage-operators/${response.data.userId}`);
                    }
                    else {
                        navigate(`/manage-pensioners/${response.data.userId}`);
                    }
                }
            } catch (error) {
                console.log('User is not authenticated or token is invalid.');
                navigate('/')
            }
        };

        checkAuthToken();
    }, []);

    const getPensioners = async () => {
        let data = await fetch(`https://fyp-enrollment-server.vercel.app/getPensioners`);
        let res = await data.json();
        setAllPensioners(res);
        setTempAllPensioners(res)
    }

    useEffect(() => {
        if (allPensioners.length === 0) {
            getPensioners();
        }
    }, [])

    const handleUpdateClick = (pensioner) => {
        setShowUpdateModal(true);
        setPensioner({
            _id: pensioner._id, name: pensioner.name, urduName: pensioner.urduName, password: pensioner.password,
            number: pensioner.number, address: pensioner.address, pensionBank: pensioner.pensionBank, city: pensioner.city,
            urduPensionBank: pensioner.urduPensionBank, urduCity: pensioner.urduCity, email: pensioner.email,
            cnic: pensioner.cnic
        })
    };
    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleAccountClick = () => {
        setShowAccountModal(true)
    }
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };


    const handleFilterChange = (event) => {
        setFilterText(event.target.value)
        setPage(0)
        if (event.target.value) {
            setTempAllPensioners(allPensioners.filter((pensioner) =>
                pensioner.cnic.includes(event.target.value)
            ))
        }
        else {
            console.log('empty');

            setTempAllPensioners(allPensioners)
        }

    }
    const handleCityChange = (event) => {
        setSearchCity(event.target.value)
        console.log('direct select', event.target.value);

        setPage(0)
        if (event.target.value) {
            setTempAllPensioners(allPensioners.filter((pensioner) =>
                pensioner.city.toLowerCase().includes(event.target.value.toLowerCase())
            ))
        }
        else {
            console.log('empty');

            setTempAllPensioners(allPensioners)
        }

    }


    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle change in rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);  // Reset the table to the first page whenever rows per page changes
    };
    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: (option) => option,
    });


    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="20%"
                padding="2rem"
                border="ActiveBorder"
                fullWidth
            >
                <Card sx={{ width: '90%', padding: '2rem', border: '2px solid black', borderRadius: '8px' }}>
                    <TableContainer>
                        <Box display="flex" justifyContent="flex-start">
                            <Button variant='contained' onClick={handleAddClick}>Add New pensioner</Button>
                        </Box>
                        <Box display="flex" justifyContent="space-between" gap="10px" marginBottom="10px"
                            marginTop="10px">
                            <Box >
                                <TextField
                                    label="Search By CNIC"
                                    variant="outlined"
                                    value={filterText}
                                    onChange={handleFilterChange}
                                >

                                </TextField>
                            </Box>

                            <Box>
                                <Autocomplete
                                    options={cities}
                                    onInputChange={(_, newInputValue) => {
                                        // Check if the input is empty to trigger the clear function
                                        if (newInputValue === "") {
                                            setTempAllPensioners(allPensioners)
                                        }
                                    }}
                                    getOptionLabel={(option) => option}
                                    filterOptions={filterOptions}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <
                                        TextField {...params} label="Filter By City"
                                        value={searchCity}
                                        onChange={handleCityChange}
                                    />}
                                />
                            </Box>
                        </Box>
                        <hr></hr>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">CNIC</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope='col'>City</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope='col'>Pension Bank</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Contact Number</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Address</TableCell>
                                    <TableCell scope="col">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tempAllPensioner !== null ? tempAllPensioner.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pensioner, index) => (
                                    <TableRow
                                        key={pensioner.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.name}</TableCell>

                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.cnic}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.city}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.pensionBank}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.number}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.address}</TableCell>
                                        <TableCell align='center'>
                                            <IconButton color='secondary' onClick={() => handleUpdateClick(pensioner)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color='secondary' onClick={() => {
                                                setCurrentPensionerData({ cnic: pensioner.cnic });
                                                setShowVerificationModal(true)
                                            }}>
                                                <EmergencyRecordingIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )) : (<TableRow><TableCell>Loading... </TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                        <TablePagination sx={{ fontSize: '1.1rem' }}
                            component="div"
                            count={allPensioners != null ? allPensioners.length : 0}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}  // Options for rows per page
                        />
                    </TableContainer>
                    <hr></hr>
                </Card>
            </Box >
            <AddModal
                show={showAddModal}
                updateVerify={() => setShowVerificationModal(true)}
                onClose={() => { setShowAddModal(false); getPensioners() }}
            // onUpdate={handleUpdate}
            />
            <UpdateModal
                show={showUpdateModal}
                onClose={() => { setShowUpdateModal(false); getPensioners() }}
                pensioner={pensioner}
            // onUpdate={handleUpdate}
            />
            <Verification
                show={showVerificationModal}
                onClose={() => { setShowVerificationModal(false); }}
            // onUpdate={handleUpdate}
            />
            <ToastContainer />
        </>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px',
    },
    questionContainer: {
        fontSize: '24px',
        textAlign: 'center',
        color: 'black'
    },
    videoContainer: {
        width: '100%',
        height: '360px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

const cities = ['Ahmedpur East', 'Ahmadpur Sial', 'Alipur Chatha', 'Arifwala', 'Attock Tehsil', 'Baddomalhi', 'Bahawalnagar', 'Bahawalpur', 'Bakhri Ahmad Khan', 'Basirpur', 'Basti Dosa', 'Begowala', 'Bhakkar', 'Bhalwal', 'Bhawana', 'Bhera', 'Bhopalwala', 'Burewala', 'Chak Azam Saffo', 'Chak Jhumra', 'Chak One Hundred Twenty Nine Left', 'Chak Thirty-one -Eleven Left', 'Chak Two Hundred Forty-Nine TDA', 'Chakwal', 'Chawinda', 'Rabwah', 'Chichawatni', 'Chiniot', 'Chishtian', 'Choa Saidanshah', 'Chunian', 'Daira Din Panah', 'Dajal', 'Dandot RS', 'Darya Khan', 'Daska', 'Daultala', 'Dera Ghazi Khan', 'Dhanot', 'Dhaunkal', 'Dijkot', 'Dinan Bashnoian Wala', 'Dinga', 'Dipalpur', 'Dullewala', 'Dunga Bunga', 'Dunyapur', 'Eminabad', 'Faisalabad', 'Faqirwali', 'Faruka', 'Fazilpur', 'Fort Abbas', 'Garh Maharaja', 'Gojra', 'Gujar Khan', 'Gujranwala', 'Gujrat', 'Hadali', 'Hafizabad', 'Harnoli', 'Harunabad', 'Hasilpur', 'Haveli Lakha', 'Hazro', 'Hujra Shah Muqeem', 'Jahanian Shah', 'Jalalpur Jattan', 'Jalalpur Pirwala', 'Jampur', 'Jand', 'Jandiala Sher Khan', 'Jaranwala', 'Jatoi Shimali', 'Jauharabad', 'Jhang', 'Jhang Sadar', 'Jhawarian', 'Jhelum', 'Kabirwala', 'Kahna Nau', 'Kahuta', 'Kalabagh', 'Kalaswala', 'Kaleke Mandi', 'Kallar Kahar', 'Kalur Kot', 'Kamalia', 'Kamar Mushani', 'Kamoke', 'Kamra', 'Kanganpur', 'Karor', 'Kasur', 'Keshupur', 'Khairpur Tamiwali', 'Khandowa', 'Khanewal', 'Khanga Dogran', 'Khangarh', 'Khanpur', 'Kharian', 'Khewra', 'Khurrianwala', 'Khushab', 'Kot Addu Tehsil', 'Kot Ghulam Muhammad', 'Kot Mumin', 'Kot Radha Kishan', 'Kot Rajkour', 'Kot Samaba', 'Kot Sultan', 'Kotli Loharan', 'Kundian', 'Kunjah', 'Ladhewala Waraich', 'Lahore', 'Lala Musa', 'Lalian', 'Layyah', 'Layyah District', 'Liliani', 'Lodhran', 'Mailsi', 'Malakwal', 'Malakwal City', 'Mamu Kanjan', 'Mananwala', 'Mandi Bahauddin', 'Mangla', 'Mankera', 'Mehmand Chak', 'Mian Channun', 'Mianke Mor', 'Mianwali', 'Minchinabad', 'Mitha Tiwana', 'Moza Shahwala', 'Multan', 'Muridke', 'Murree', 'Mustafabad', 'Muzaffargarh', 'Nankana Sahib', 'Narang Mandi', 'Narowal', 'Naushahra Virkan', 'Nazir Town', 'Okara', 'Pakpattan', 'Pasrur', 'Pattoki', 'Phalia', 'Pind Dadan Khan', 'Pindi Bhattian', 'Pindi Gheb', 'Pir Mahal', 'Qadirpur Ran', 'Rahim Yar Khan', 'Raiwind', 'Raja Jang', 'Rajanpur', 'Rasulnagar', 'Rawalpindi', 'Rawalpindi District', 'Renala Khurd', 'Rojhan', 'Sadiqabad', 'Sahiwal', 'Sambrial', 'Sangla Hill', 'Sanjwal', 'Sarai Alamgir', 'Sarai Sidhu', 'Sargodha', 'Shorkot', 'Shahpur', 'Shahr Sultan', 'Shakargarh', 'Sharqpur', 'Sheikhupura', 'Shujaabad', 'Sialkot', 'Sillanwali', 'Sodhra', 'Sukheke Mandi', 'Surkhpur', 'Talagang', 'Talamba', 'Tandlianwala', 'Taunsa', 'Toba Tek Singh', 'Vihari', 'Wazirabad', 'Yazman', 'Zafarwal', 'Zahir Pir', 'Chuhar Kana', 'Dhok Awan', 'Daud Khel', 'Ferozewala', 'Gujranwala Division', 'Hasan Abdal', 'Kohror Pakka', 'Mandi Bahauddin District', 'Multan District', 'Pakki Shagwanwali', 'Qila Didar Singh', 'Rahimyar Khan District', 'Shahkot Tehsil', 'Umerkot', 'Wah', 'Warburton', 'West Punjab']
const citiesUrdu = [
    'احمدپور شرقیہ', 'احمدپور سیال', 'علی پور چٹھہ', 'عارف والا', 'اٹک تحصیل', 'بدوملہی', 'بہاولنگر',
    'بہاولپور', 'بخری احمد خان', 'بسیراپور', 'بستی دوسہ', 'بیگووالہ', 'بھکر', 'بھلوال', 'بھوانہ',
    'بھیرہ', 'بھوپال والا', 'بورے والا', 'چک اعظم صفو', 'چک جھمرہ', 'چک 129 بائیں', 'چک 31-11 بائیں',
    'چک 249 ٹی ڈی اے', 'چکوال', 'چونڈہ', 'ربوہ', 'چیچہ وطنی', 'چنیوٹ', 'چشتیاں', 'چوآ سیدن شاہ',
    'چونیاں', 'دایرہ دین پناہ', 'ڈجال', 'ڈنڈوت آر ایس', 'دریا خان', 'ڈسکہ', 'دولتالا', 'ڈیرہ غازی خان',
    'دھنوت', 'دھونکل', 'ڈجکوٹ', 'دینان بشنوئین والا', 'ڈنگہ', 'دیپالپور', 'دل والا', 'ڈونگا بونگا',
    'دنیا پور', 'ایمن آباد', 'فیصل آباد', 'فقیر والی', 'فروکہ', 'فاضل پور', 'فورٹ عباس', 'گڑھ مہاراجہ',
    'گوجرہ', 'گوجر خان', 'گوجرانوالہ', 'گجرات', 'حدالی', 'حافظ آباد', 'ہرنولی', 'ہارون آباد',
    'حاصل پور', 'حویلی لکھا', 'حضرو', 'ہجرا شاہ مقیم', 'جہانیاں شاہ', 'جلالپور جٹاں', 'جلالپور پیر والا',
    'جام پور', 'جند', 'جندالہ شیر خان', 'جرانوالہ', 'جاتوی شمالی', 'جوہر آباد', 'جھنگ', 'جھنگ صدر',
    'جھاوریان', 'جہلم', 'کبیر والا', 'کاہنہ نو', 'کہوٹہ', 'کلاباغ', 'کالاسوالا', 'کالکے منڈی', 'کلر کہار',
    'کلور کوٹ', 'کمالیہ', 'کمر مشانی', 'کامونکی', 'کامرا', 'کنجن پور', 'کرور', 'قصور', 'کیشوپور',
    'خیرپور تامیوالی', 'کھنڈوا', 'خانیوال', 'خانگا ڈوگراں', 'خانگڑھ', 'خانپور', 'کھاریاں', 'خھیوڑہ',
    'کھریاں والا', 'خوشاب', 'کوٹ ادو تحصیل', 'کوٹ غلام محمد', 'کوٹ مومن', 'کوٹ رادھا کشن', 'کوٹ راجکور',
    'کوٹ سامابہ', 'کوٹ سلطان', 'کوٹلی لوہاراں', 'کنڈیان', 'کنجاہ', 'لدھیوالا وڑائچ', 'لاہور', 'لالہ موسی',
    'لالیاں', 'لیہ', 'لیہ ضلع', 'لیلیانی', 'لودھراں', 'میلسی', 'ملکوال', 'ملکوال شہر', 'ماموں کانجن',
    'منانوالہ', 'منڈی بہاؤالدین', 'منگلا', 'منکیرہ', 'محمد چک', 'میان چنوں', 'میانکے موڑ', 'میانوالی',
    'منچن آباد', 'مٹھا تیوانہ', 'موزہ شاہ والا', 'ملتان', 'مریدکے', 'مری', 'مصطفی آباد', 'مظفر گڑھ',
    'ننکانہ صاحب', 'نارنگ منڈی', 'نارووال', 'نوشہرہ ورکاں', 'نذیر ٹاؤن', 'اوکاڑہ', 'پاکپتن', 'پسرور',
    'پتوکی', 'پھالیہ', 'پنڈ دادن خان', 'پنڈی بھٹیاں', 'پنڈی گھیب', 'پیر محل', 'قادری پور ران', 'رحیم یار خان',
    'رائیونڈ', 'راجہ جنگ', 'راجن پور', 'رسول نگر', 'راولپنڈی', 'راولپنڈی ضلع', 'رینالہ خورد', 'روجھان',
    'صادق آباد', 'ساہیوال', 'سمبڑیال', 'سانگلہ ہل', 'سنجوال', 'سرائے عالمگیر', 'سرائے سدھو', 'سرگودھا',
    'شورکوٹ', 'شاہپور', 'شہر سلطان', 'شکر گڑھ', 'شرقپور', 'شیخوپورہ', 'شجاع آباد', 'سیالکوٹ', 'سلانوالی',
    'سدھرا', 'سکھیکی منڈی', 'سرخپور', 'تلہ گنگ', 'تلمبہ', 'تاندلیانوالہ', 'تونسا', 'ٹوبہ ٹیک سنگھ',
    'وہاڑی', 'وزیر آباد', 'یزمان', 'ظفر وال', 'ظہیر پیر', 'چوہر کانہ', 'ڈھوک اعوان', 'داؤد خیل', 'فیروز والا',
    'گوجرانوالہ ڈویژن', 'حسن ابدال', 'کروڑ پکا', 'منڈی بہاؤالدین ضلع', 'ملتان ضلع', 'پکی شگوان والی',
    'قلعہ دیدار سنگھ', 'رحیم یار خان ضلع', 'شاہ کوٹ تحصیل', 'عمرکوٹ', 'واہ', 'واربرٹن', 'مغربی پنجاب'
];
const pakistanBanksEnglish = [
    "Allied Bank Limited",
    "Askari Bank Limited",
    "Bank Alfalah Limited",
    "Bank Al Habib Limited",
    "Bank Islami Pakistan Limited",
    "Dubai Islamic Bank Pakistan Limited",
    "Faysal Bank Limited",
    "First Women Bank Limited",
    "Habib Bank Limited",
    "Habib Metropolitan Bank Limited",
    "JS Bank Limited",
    "MCB Bank Limited",
    "MCB Islamic Bank Limited",
    "Meezan Bank Limited",
    "National Bank of Pakistan",
    "SILK Bank Limited",
    "Sindh Bank Limited",
    "Soneri Bank Limited",
    "Standard Chartered Bank Pakistan Limited",
    "Summit Bank Limited",
    "The Bank of Khyber",
    "The Bank of Punjab",
    "United Bank Limited",
    "Zarai Taraqiati Bank Limited"
];
const pakistanBanksUrdu = [
    "الائیڈ بینک لمیٹڈ",
    "عسکری بینک لمیٹڈ",
    "بینک الفلاح لمیٹڈ",
    "بینک الحبیب لمیٹڈ",
    "بینک اسلامی پاکستان لمیٹڈ",
    "دبئی اسلامک بینک پاکستان لمیٹڈ",
    "فیصل بینک لمیٹڈ",
    "فرسٹ ویمن بینک لمیٹڈ",
    "حبیب بینک لمیٹڈ",
    "حبیب میٹروپولیٹن بینک لمیٹڈ",
    "جے ایس بینک لمیٹڈ",
    "ایم سی بی بینک لمیٹڈ",
    "ایم سی بی اسلامک بینک لمیٹڈ",
    "میزان بینک لمیٹڈ",
    "نیشنل بینک آف پاکستان",
    "سلک بینک لمیٹڈ",
    "سندھ بینک لمیٹڈ",
    "سونیری بینک لمیٹڈ",
    "اسٹینڈرڈ چارٹرڈ بینک پاکستان لمیٹڈ",
    "سمٹ بینک لمیٹڈ",
    "بینک آف خیبر",
    "بینک آف پنجاب",
    "یونائیٹڈ بینک لمیٹڈ",
    "زرعی ترقیاتی بینک لمیٹڈ"
];



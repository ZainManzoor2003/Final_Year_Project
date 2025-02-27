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

            });
        }
    }, [pensioner])

    if (!show) return null;

    const validateFields = () => {
        const { name, password, number, address, pensionBank, city, urduName, urduCity, urduPensionBank } = currentOperator;
        const urduRegex = /^[\u0600-\u06FF\u0750-\u077F\s]+$/;

        if (!name || !number || !address || !password || !pensionBank || !city || !urduName
            || !urduPensionBank || !urduCity) {
            alert("Any Field is required.");
            return false;
        }
        if (!urduRegex.test(urduCity)) {
            alert('شہر must be in urdu')
            return false
        }
        if (!urduRegex.test(urduPensionBank)) {
            alert('پنشن بینک must be in urdu')
            return false
        }
        if (!urduRegex.test(urduName)) {
            alert('نام must be in urdu')
            return false
        }

        // Check if password contains only allowed characters and no whitespace
        if (!/^[a-z0-9@_]+$/.test(password)) {
            alert("Password should contain only lowercase letters, digits, '@', '_', and no whitespace.");
            return false;
        }

        // Check if number contains only digits
        if (!/^\d+$/.test(number)) {
            alert("Number should contain only digits.");
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
            <div className="modal-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h2>Update Pensioner</h2>
                <label>Name:</label>
                <input
                    type="text"
                    value={currentOperator.name}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={15}
                />
                <label className='urduLabel'>:نام</label>
                <input
                    type="text"
                    value={currentOperator.urduName || ''}
                    onChange={(e) => { setCurrentOperator(pre => ({ ...pre, urduName: e.target.value })) }}
                    maxLength={15}
                    className='urduInput'
                />
                <label>Username:</label>
                <input
                    type="text"
                    value={currentOperator.username}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, username: e.target.value }))}
                    maxLength={14}
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={currentOperator.password}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, password: e.target.value }))}
                    maxLength={13}
                />
                <label>City:</label>
                <input
                    type="text"
                    value={currentOperator.city}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, city: e.target.value }))}
                    maxLength={13}
                />
                <label className='urduLabel'>:شہر</label>
                <input
                    type="text"
                    value={currentOperator.urduCity || ''}
                    onChange={(e) => { setCurrentOperator(pre => ({ ...pre, urduCity: e.target.value })) }}
                    maxLength={20}
                    className='urduInput'
                />
                <label>Pension Bank:</label>
                <input
                    type="text"
                    value={currentOperator.pensionBank}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, pensionBank: e.target.value }))}
                    maxLength={20}
                />
                <label className='urduLabel'>:پنشن بینک</label>
                <input
                    type="text"
                    value={currentOperator.urduPensionBank || ''}
                    onChange={(e) => { setCurrentOperator(pre => ({ ...pre, urduPensionBank: e.target.value })) }}
                    maxLength={20}
                    className='urduInput'
                />
                <label>Number:</label>
                <input
                    type="text"
                    value={currentOperator.number}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, number: e.target.value }))}
                    maxLength={11}
                />
                <label>Address:</label>
                <input
                    type="text"
                    value={currentOperator.address}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, address: e.target.value }))}
                    maxLength={35}
                />
                <button onClick={handleSubmit}>Update</button>
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
        const name = e.target.value;
        setCurrentPensioner(prev => ({ ...prev, name }));
    };

    // Validation function
    const validateFields = () => {
        const { name, cnic, email, number, address, dob, pensionBank, city, urduName, urduCity, urduPensionBank } = currentPensioner;
        const urduRegex = /^[\u0600-\u06FF\u0750-\u077F\s]+$/;

        if (!name || !cnic || !email || !number || !address || !dob || !pensionBank || !city || !urduCity
            || !urduPensionBank || !urduCity) {
            alert("Any field is required.");
            return false;
        }
        if (!urduRegex.test(urduCity)) {
            alert('شہر must be in urdu')
            return false
        }
        if (!urduRegex.test(urduPensionBank)) {
            alert('پنشن بینک must be in urdu')
            return false
        }
        if (!urduRegex.test(urduName)) {
            alert('نام must be in urdu')
            return false
        }

        if (!/^\d+$/.test(cnic)) {
            alert("CNIC should contain only numbers.");
            return false;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert("Invalid email format.");
            return false;
        }

        if (!/^\d+$/.test(number)) {
            alert("Number should contain only digits.");
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
            <div className="modal-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h2>Add Pensioner</h2>

                <label>Name:</label>
                <input
                    type="text"
                    value={currentPensioner.name || ''}
                    onChange={handleNameChange}
                    maxLength={15}
                />
                <label className='urduLabel'>:نام</label>
                <input
                    type="text"
                    value={currentPensioner.urduName || ''}
                    onChange={(e) => { setCurrentPensioner(pre => ({ ...pre, urduName: e.target.value })) }}
                    maxLength={15}
                    className='urduInput'
                />


                <label>CNIC:</label>
                <input
                    type="text"
                    value={currentPensioner.cnic || ''}
                    maxLength={13}
                    onChange={(e) => {
                        setCurrentPensioner(prev => ({ ...prev, cnic: e.target.value }));
                        setCurrentPensionerData({ cnic: e.target.value });
                    }}
                />

                <label>Email:</label>
                <input
                    type="text"
                    value={currentPensioner.email || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, email: e.target.value }))}
                    maxLength={30}
                />


                <label>Number:</label>
                <input
                    type="text"
                    value={currentPensioner.number || ''}
                    maxLength={11}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, number: e.target.value }))}
                />

                <label>Address:</label>
                <input
                    type="text"
                    value={currentPensioner.address || ''}
                    maxLength={35}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, address: e.target.value }))}
                />
                <label>City:</label>
                <input
                    type="text"
                    value={currentPensioner.city || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, city: e.target.value }))}
                    maxLength={20}
                />
                <label className='urduLabel'>:شہر</label>
                <input
                    type="text"
                    value={currentPensioner.urduCity || ''}
                    onChange={(e) => { setCurrentPensioner(pre => ({ ...pre, urduCity: e.target.value })) }}
                    maxLength={20}
                    className='urduInput'
                />
                <label>Pension Bank:</label>
                <input
                    type="text"
                    value={currentPensioner.pensionBank || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, pensionBank: e.target.value }))}
                    maxLength={20}
                />
                <label className='urduLabel'>:پنشن بینک</label>
                <input
                    type="text"
                    value={currentPensioner.urduPensionBank || ''}
                    onChange={(e) => { setCurrentPensioner(pre => ({ ...pre, urduPensionBank: e.target.value })) }}
                    maxLength={20}
                    className='urduInput'
                />

                <label>DOB:</label>
                <input
                    type="date"
                    value={currentPensioner.dob || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, dob: e.target.value }))}
                />

                <button onClick={handleSubmit}>Add</button>
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
            urduPensionBank: pensioner.urduPensionBank, urduCity: pensioner.urduCity
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
                pensioner.cnic.includes(filterText)
            ))
        }
        else {
            console.log('empty');

            setTempAllPensioners(allPensioners)
        }

    }
    const handleCityChange = (event) => {
        setSearchCity(event.target.value)
        setPage(0)
        if (event.target.value) {
            setTempAllPensioners(allPensioners.filter((pensioner) =>
                pensioner.city.toLowerCase().includes(searchCity.toLowerCase())
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
                        <Box display="flex" justifyContent="flex-end" gap="10px" marginBottom="10px">

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
                            <Box >
                                <TextField
                                    label="Search pensioner"
                                    variant="outlined"
                                    value={filterText}
                                    onChange={handleFilterChange}
                                >

                                </TextField>
                            </Box>
                        </Box>
                        <hr></hr>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Cnic</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope='col'>City</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope='col'>Pension Bank</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Phone Number</TableCell>
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
                                        <TableCell sx={{ fontSize: '1.1rem' }} scope="row">{page * rowsPerPage + index + 1}</TableCell>

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
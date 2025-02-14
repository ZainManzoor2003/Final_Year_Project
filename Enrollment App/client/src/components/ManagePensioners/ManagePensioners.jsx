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

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
                username: pensioner.username,
                password: pensioner.password,
                number: pensioner.number,
                address: pensioner.address,
                pensionBank: pensioner.pensionBank,
                city: pensioner.city
            });
        }
    }, [pensioner])

    if (!show) return null;

    const validateFields = () => {
        const { name, username, password, number, address, pensionBank, city } = currentOperator;

        if (!name || !username || !number || !address || !password || !pensionBank || !city) {
            alert("Any Field is required.");
            return false;
        }

        // Check if username only contains lowercase letters, underscores, and digits
        if (!/^[a-z0-9_]+$/.test(username)) {
            alert("Username should contain only lowercase letters, underscores, and digits.");
            return false;
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
            await axios.post(`http://localhost:3001/updatePensioner`, currentOperator)
                .then((res) => {
                    alert(res.data.message);
                    onClose()
                })

        } catch (error) {
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
                    maxLength={10}
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
                <label>Pension Bank:</label>
                <input
                    type="text"
                    value={currentOperator.pensionBank}
                    onChange={(e) => setCurrentOperator(prev => ({ ...prev, pensionBank: e.target.value }))}
                    maxLength={13}
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
    const { getRandomNumbers, randomQuestions, playSound, startVerify, setStartVerify,
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

            // Append each video blob to FormData
            videoFiles.forEach((blob, index) => {
                formData.append('videos', blob, `${currentPensionerData.cnic}` + '_' + `${index + 1}` + '.mp4');
            });

            try {
                const response = await axios.post('http://localhost:5001/extract_images', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Videos uploaded successfully:', response.data);
            } catch (error) {
                console.error('Error uploading videos:', error);
            }
        }
        videoFiles.length == 2 && takeScreenshots()

    }, [videoFiles])
    useEffect(() => {

        if (videoUploaded) {
            setIndex(index + 1);
            if (index === 10) {
                setVideoUploaded(false);
                toast.success(`Penioner Enrolled Successfully`, {
                    position: 'top-center',
                    autoClose: 3000
                })
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
        getRandomNumbers();
    }, []);

    useEffect(() => {
        const changeQuestion = async () => {
            // console.log('change question', index);

            if (randomQuestions.length > 0 && index <= 10 && startVerify) {
                setRecordingDisabled(true);
                await playSound(randomQuestions[index].file);
                setQuestion(randomQuestions[index].text);
                setTimeout(() => {
                    setRecordingDisabled(false);
                }, 4000);
            }
        };
        changeQuestion();
    }, [index, startVerify]);
    useEffect(() => {
        console.log(videoUrl);

    }, [videoUrl])

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
                        const response = await axios.post("http://localhost:3001/upload", formData, {
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
        videoFiles.length == 2 && convertToWav()
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
                                        <button disabled={seconds <= 5} style={styles.button} onClick={handleStopCaptureClick}>
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



    const generateUsername = (name) => {
        if (!name) return "";

        const randomDigits = Math.floor(Math.random() * 900) + 100;
        const username = `${name.toLowerCase()}_${randomDigits}`;
        setCurrentPensioner(prev => ({ ...prev, username }));
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setCurrentPensioner(prev => ({ ...prev, name }));
        generateUsername(name);
    };

    // Validation function
    const validateFields = () => {
        const { name, cnic, email, number, address, dob, pensionBank, city } = currentPensioner;

        if (!name || !cnic || !email || !number || !address || !dob || !pensionBank || !city) {
            alert("Any field is required.");
            return false;
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
            const response = await axios.post(`http://localhost:3001/addPensioner`, currentPensioner);
            alert(response.data.mes);
            onClose();

            if (response.data.mes === 'Pensioner Registered Successfully and Email Sent') {
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
                    maxLength={10}
                />

                <label>Username (auto-generated):</label>
                <input
                    type="text"
                    value={currentPensioner.username || ''}
                    readOnly
                />

                <label>CNIC:</label>
                <input
                    type="text"
                    value={currentPensioner.cnic || ''}
                    maxLength={13}
                    onChange={(e) => {
                        setCurrentPensioner(prev => ({ ...prev, cnic: e.target.value }));
                        setCurrentPensionerData(prev => ({ ...prev, cnic: e.target.value }));
                    }}
                />

                <label>Email:</label>
                <input
                    type="text"
                    value={currentPensioner.email || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, email: e.target.value }))}
                    maxLength={30}
                />

                <label>Password (auto-generated):</label>
                <input
                    type="password"
                    value={currentPensioner.password || ''}
                    readOnly
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
                <label>Pension Bank:</label>
                <input
                    type="text"
                    value={currentPensioner.pensionBank || ''}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, pensionBank: e.target.value }))}
                    maxLength={15}
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
    const [allPensioners, setAllPensioners] = useState([]);
    const [tempAllPensioner, setTempAllPensioners] = useState([]);
    const [filterText, setFilterText] = useState("")
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
        let data = await fetch(`http://localhost:3001/getPensioners`);
        let res = await data.json();
        setAllPensioners(res);
        setTempAllPensioners(res)
    }

    useEffect(() => {
        if (allPensioners.length === 0) {
            getPensioners();
        }
    }, [])



    const enableDisablePensioner = async (pensioner) => {
        try {
            await axios.post('http://localhost:3001/enableDisablePensioner', pensioner)
                .then((res) => {
                    if (res.data.message === 'Successfull') {
                        getPensioners()
                    }
                })
        } catch (error) {
            console.log(error.message);

        }
    }
    const handleUpdateClick = (pensioner) => {
        setShowUpdateModal(true);
        setPensioner({
            _id: pensioner._id, name: pensioner.name, username: pensioner.username, password: pensioner.password,
            number: pensioner.number, address: pensioner.address, pensionBank: pensioner.pensionBank, city: pensioner.city
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
                pensioner.name.toLowerCase().includes(filterText.toLowerCase())
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
                <Card sx={{ width: '80%', padding: '2rem', border: '2px solid black', borderRadius: '8px' }}>
                    <TableContainer>
                        <Box display="flex" justifyContent="flex-start">
                            <Button variant='contained' onClick={handleAddClick}>Add New pensioner</Button>
                        </Box>

                        <Box display="flex" justifyContent="flex-end" >
                            <TextField
                                label="Search pensioner"
                                variant="outlined"
                                value={filterText}
                                onChange={handleFilterChange}
                            >

                            </TextField>
                        </Box>
                        <hr></hr>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Username</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope='col'>City</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope='col'>Pension Bank</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} scope="col">Number</TableCell>
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

                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.username}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.city}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.pensionBank}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.number}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{pensioner.address}</TableCell>
                                        <TableCell align='center'>
                                            <IconButton color='secondary' onClick={() => handleUpdateClick(pensioner)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color='secondary' onClick={() => enableDisablePensioner(pensioner)}>
                                                <Switch {...label} defaultChecked={pensioner.enable == false ? false : true} />
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
            </Box>
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
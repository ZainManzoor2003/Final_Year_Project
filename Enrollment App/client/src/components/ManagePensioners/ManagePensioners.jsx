import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import './ManagePensioners.css'
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import CreateContextApi from '../../ContextApi/CreateContextApi';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc'

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
            alert('taking screenshots api called')
            const formData = new FormData();

            // Append each video blob to FormData
            videoFiles.forEach((blob, index) => {
                formData.append('videos', blob, `${currentPensionerData.cnic}` + '_' + `${index + 1}` + '.mp4');
            });

            try {
                const response = await axios.post('http://192.168.1.79:5001/extract_images', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Videos uploaded successfully:', response.data);
            } catch (error) {
                console.error('Error uploading videos:', error);
            }
        }
        if (videoFiles.length == 1) {
            // takeScreenshots()
        }
        console.log(videoFiles);

    }, [videoFiles])
    useEffect(() => {

        if (videoUploaded) {
            setIndex(index + 1);
            if (index === 4) {
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
        getRandomNumbers();
    }, []);

    useEffect(() => {
        const changeQuestion = async () => {
            // console.log('change question', index);

            if (randomQuestions.length > 0 && index <= 4 && startVerify) {
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
            if (recordedChunks.length) {
                const blob = new Blob(recordedChunks, {
                    type: "video/mp4"
                })
                const formData = new FormData();
                formData.append("files", blob, `${currentPensionerData.cnic}` + '_' + `${index + 1}` + '.mp4');

                try {
                    let response = await axios.post('http://192.168.1.79:5001/convert', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        responseType: 'json'
                    });
                } catch (error) {
                    Alert.alert('Error uploading mp4 file to convert it into wav', error.message);
                }
            }
        }

        videoRecorded && convertToWav()

    }, [videoRecorded])

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

const UpdateModal = ({ show, onClose, pensioner }) => {

    const [currentPensioner, setCurrentPensioner] = useState({});

    useEffect(() => {
        if (pensioner) {
            console.log(pensioner);

            setCurrentPensioner({
                _id: pensioner._id,
                name: pensioner.name, username: pensioner.username, password: pensioner.password,
                number: pensioner.number, address: pensioner.address
            });
        }
    }, [pensioner])

    if (!show) return null;

    const validateFields = () => {
        const { name, username, password, number, address } = currentPensioner;

        if (!name || !username || !number || !address || !password) {
            alert("Any Field is required.");
            return false;
        }

        // Check if username only contains lowercase letters, underscores, and digits
        if (!/^[a-z0-9@_]+$/.test(username)) {
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
            await axios.post(`http://localhost:3001/updatePensioner`, currentPensioner)
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
                    value={currentPensioner.name}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={10}
                />
                <label>Username:</label>
                <input
                    type="text"
                    value={currentPensioner.username}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, username: e.target.value }))}
                    maxLength={14}
                />
                <label>Password:</label>
                <input
                    type="text"
                    value={currentPensioner.password}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, password: e.target.value }))}
                    maxLength={14}
                />
                <label>Number:</label>
                <input
                    type="text"
                    value={currentPensioner.number}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, number: e.target.value }))}
                    maxLength={11}
                />
                <label>Address:</label>
                <input
                    type="text"
                    value={currentPensioner.address}
                    onChange={(e) => setCurrentPensioner(prev => ({ ...prev, address: e.target.value }))}
                    maxLength={35}
                />
                <button onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
};

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
        const { name, cnic, email, number, address, dob } = currentPensioner;

        if (!name || !cnic || !email || !number || !address || !dob) {
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
                    type="text"
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



const UpdateAccountModal = ({ show, onClose, operatorInfo }) => {

    const [operator, setOperator] = useState({});

    useEffect(() => {
        if (operatorInfo) {
            setOperator({
                _id: operatorInfo._id,
                name: operatorInfo.name,
                username: operatorInfo.username,
                password: operatorInfo.password,
                number: operatorInfo.number,
                address: operatorInfo.address
            });
        }
    }, [operatorInfo])

    if (!show) return null;

    const validateFields = () => {
        const { name, username, password, number, address } = operatorInfo;

        if (!name || !username || !number || !address || !password) {
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
            await axios.post(`http://localhost:3001/updateOperator`, operator)
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
                <h2>Update Account Info</h2>
                <label>Name:</label>
                <input
                    type="text"
                    value={operator.name}
                    onChange={(e) => setOperator(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={10}
                />
                <label>Username:</label>
                <input
                    type="text"
                    value={operator.username}
                    onChange={(e) => setOperator(prev => ({ ...prev, username: e.target.value }))}
                    maxLength={14}
                />
                <label>Password:</label>
                <input
                    type="text"
                    value={operator.password}
                    onChange={(e) => setOperator(prev => ({ ...prev, password: e.target.value }))}
                    maxLength={14}
                />
                <label>Number:</label>
                <input
                    type="text"
                    value={operator.number}
                    onChange={(e) => setOperator(prev => ({ ...prev, number: e.target.value }))}
                    maxLength={11}
                />
                <label>Address:</label>
                <input
                    type="text"
                    value={operator.address}
                    onChange={(e) => setOperator(prev => ({ ...prev, address: e.target.value }))}
                    maxLength={35}
                />
                <button onClick={handleSubmit}>Update</button>
            </div>
        </div>
    );
};

export default function ManagePensioners() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isToggled, setIsToggled] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [allPensioners, setAllPensioners] = useState([]);
    const [pensioner, setPensioner] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const { operatorInfo, setOperatorInfo, currentPensionerData } = useContext(CreateContextApi)

    const getPensioners = async () => {
        let data = await fetch(`http://localhost:3001/getPensioners`);
        let res = await data.json();
        setAllPensioners(res);
    }

    const getAccountInfo = async () => {
        let data = await fetch(`http://localhost:3001/getAccountInfo/${id}`);
        let res = await data.json();
        setOperatorInfo(res);
    }

    useEffect(() => {
        getAccountInfo();
    }, [])

    useEffect(() => {
        if (allPensioners.length === 0) {
            getPensioners();
        }
    }, [])


    const handleClick = () => {
        setIsToggled(!isToggled);
    };
    const handleUpdateClick = (pensioner) => {
        setShowUpdateModal(true);
        setPensioner({
            _id: pensioner._id, name: pensioner.name, username: pensioner.username, password: pensioner.password,
            number: pensioner.number, address: pensioner.address
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
    return (
        <>
            <>
                <div className="my-orders">
                    <div className="hamburger-container">
                        <div className="hamburger" onClick={toggleMenu}>
                            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                            <div className={`bar ${isOpen ? 'open' : ''}`}></div>
                        </div>
                        {isOpen && (
                            <div className="dropdown">
                                <ul>
                                    <li onClick={() => handleAccountClick()}>Account</li>
                                    <li>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="my_orders_form">
                        <div className="top">
                            <h2>Manage <span>Pensioners</span></h2>
                            <button onClick={() => handleAddClick()}>Add Pensioner</button>
                        </div>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Number</th>
                                <th>Address</th>
                                <th>Edit</th>
                            </tr>
                            {allPensioners.map((pensioner, index) => (
                                <tr key={index}>
                                    <td>{pensioner.name}</td>
                                    <td>{pensioner.username}</td>
                                    <td>{pensioner.password}</td>
                                    <td>{pensioner.number}</td>
                                    <td>{pensioner.address}</td>
                                    <td> <span style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleUpdateClick(pensioner)}><FaEdit /></span></td>
                                </tr>
                            ))}

                        </table>
                    </div>
                </div>
                <UpdateModal
                    show={showUpdateModal}
                    onClose={() => { setShowUpdateModal(false); getPensioners() }}
                    pensioner={pensioner}
                // onUpdate={handleUpdate}
                />
                <AddModal
                    show={showAddModal}
                    updateVerify={() => setShowVerificationModal(true)}
                    onClose={() => { setShowAddModal(false); getPensioners() }}
                // onUpdate={handleUpdate}
                />
                <UpdateAccountModal
                    show={showAccountModal}
                    onClose={() => { setShowAccountModal(false); getAccountInfo(); toggleMenu(); }}
                    operatorInfo={operatorInfo}
                // onUpdate={handleUpdate}
                />
                <Verification
                    show={showVerificationModal}
                    onClose={() => { setShowVerificationModal(false); }}
                // onUpdate={handleUpdate}
                />
                {/* <ToastContainer /> */}
            </>
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
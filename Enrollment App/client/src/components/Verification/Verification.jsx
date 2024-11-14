import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc'
import CreateContextApi from '../../ContextApi/CreateContextApi';
import axios from 'axios'

export default function Verification() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [cameraDisabled, setCameraDisabled] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false)
  const [submit, setSubmit] = useState(null);
  const [recordingDisabled, setRecordingDisabled] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [question, setQuestion] = useState('انتظار فرمائیں');
  const [dots, setDots] = useState('.');
  const [timer, setTimer] = useState('تصدیق کا عمل شروع کریں');
  const [index, setIndex] = useState(0);
  const { getRandomNumbers, randomQuestions, playSound, startVerify, setStartVerify } = useContext(CreateContextApi);

  useEffect(() => {
    if (timer !== 'تصدیق کا عمل شروع کریں') {
      const countdown = setTimeout(() => {
        if (timer > 1) setTimer(timer - 1);
        else {
          clearTimeout(countdown);
          setStartVerify(true);
          setTimer('تصدیق کا عمل شروع کریں');
        }
      }, 1000);
    }
  }, [timer]);

  useEffect(() => {
    if (videoUploaded) {
      setIndex(index + 1);
      if (index === 4) {
        setVideoUploaded(false);
        setCameraDisabled(true);
        setSubmit(true);
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
      if (randomQuestions.length > 0 && index <= 4 && startVerify) {
        setRecordingDisabled(true);
        await playSound(randomQuestions[index].file);
        setQuestion(randomQuestions[index].text);
        setTimeout(() => {
          setRecordingDisabled(false);
        }, 5000);
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
        setRecordedChunks((pre) => pre.concat(data))
      }
    }
  }, [setRecordedChunks])

  const handleStartCaptureClick = useCallback(() => {
    setIsRecording(true)
    mediaRecorderRef.current = RecordRTC(webcamRef.current.stream, {
      type: "video"
    })
    mediaRecorderRef.current.startRecording()
    mediaRecorderRef.current.ondataavailable = handleDataAvailable
  }, [webcamRef, setIsRecording, mediaRecorderRef, handleDataAvailable])

  const handleStopCaptureClick = useCallback(() => {
    setIsRecording(false)
    mediaRecorderRef.current.stopRecording(() => {
      const blobs = mediaRecorderRef.current.getBlob()
      setRecordedChunks([blobs])
    })
  }, [setIsRecording, mediaRecorderRef])

  useEffect(() => {
    const saveVideo = async () => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/mp4"
        })

        const formData = new FormData();
        formData.append("video", blob, "recorded-video.mp4");

        try {
          const response = await axios.post("http://localhost:3001/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          console.log("Video uploaded successfully:", response.data);
        } catch (error) {
          console.error("Error uploading video:", error);
        }
      }
    }
    saveVideo()

  }, [recordedChunks])

  const download = useCallback(async () => {

    // const url = URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // document.body.appendChild(a)
    // a.style = "display: none"
    // a.href = url
    // a.download = 'react-webcam-stream-capture.webm'
    // a.click()
    // window.URL.revokeObjectURL(url)

  }, [recordedChunks])



  const saveVideo = async () => {
    setQuestion('انتظار فرمائیں');
    setVideoUploaded(false);
    // Upload logic here if needed
    setVideoUploaded(true);
  };

  return (
    <div style={styles.container}>
      {startVerify ? (
        <>
          {/* <div style={styles.questionContainer}>
            <h2>{question === 'انتظار فرمائیں' ? question + dots : question}</h2>
          </div> */}
          <div style={styles.videoContainer}>
            <Webcam
              ref={webcamRef}
              audio={true}
              mirrored={true}
              videoConstraints={{ width: 480, height: 360 }}
            />
          </div>
          <div style={styles.buttonContainer}>
            {!submit && !isRecording ? (
              <button style={styles.button} disabled={recordingDisabled} onClick={handleStartCaptureClick}>
                Start Recording
              </button>
            ) : (
              <button style={styles.button} onClick={handleStopCaptureClick}>
                Stop Recording
              </button>
            )}
          </div>
        </>
      ) : (
        <button style={styles.button} onClick={() => setTimer(3)}>
          {timer}
        </button>
      )}
    </div>
  );
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
    color: 'white'
  },
  videoContainer: {
    width: '480px',
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

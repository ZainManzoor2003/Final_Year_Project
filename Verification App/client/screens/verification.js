import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler'
import CreateContextApi from '../ContextApi/CreateContextApi';
import Button from '../components/button';
import Footer from '../components/footer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';

export default function Verification({ navigation }) {
  const doubleTapRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [cameraDisabled, setCameraDisabled] = useState(false)
  const [taskIds, setTaskIds] = useState([])
  const [videoUploaded, setVideoUploaded] = useState(false)
  const [audioResponse, setAudioResponse] = useState([])
  const [faceResponse, setFaceResponse] = useState([])
  const [finalResult, setFinalResult] = useState(-1);
  const [facing, setFacing] = useState('back');
  const [submit, setSubmit] = useState(null);
  const [recordingDisabled, setRecordingDisabled] = useState(undefined);
  const [isRecording, setIsRecording] = useState(null);
  const [videoUri, setVideoUri] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);
  const [question, setQuestion] = useState('انتظار فرمائیں');
  const [dots, setDots] = useState('.')
  const [timer, setTimer] = useState('تصدیق کا عمل شروع کریں')
  const [index, setIndex] = useState(0);
  const { getRandomNumbers, randomQuestions, playSound, startVerify, setStartVerify, currentUser, setCurrentUser } = useContext(CreateContextApi)

  useEffect(() => {
    if (timer != 'تصدیق کا عمل شروع کریں') {
      const tempTimer = setTimeout(() => {
        if (timer != 1) setTimer(timer - 1)
        else { clearTimeout(tempTimer); setStartVerify(true); setTimer('تصدیق کا عمل شروع کریں') }
      }, 1000);
    }

  }, [timer])

  useEffect(() => {
    if (videoUploaded) {
      setIndex(index + 1)
      if (index == 4) {
        setVideoUploaded(false)
        setCameraDisabled(true)
        setSubmit(true)
        // setAudioResponse(['3520282047651', 'unknown']);
        // setFaceResponse([{ "final_result": "3520282047651", "id": 2 }, { "final_result": "3520282047651", "id": 3 }])
      }
    }
  }, [videoUploaded])

  useEffect(() => {
    let tempTimer;
    if (!videoUploaded) {
      tempTimer = setTimeout(() => {
        if (dots === '...') { setDots('.') }
        else { setDots(dots + '.') }
      }, 1000);
    }
    else if (videoUploaded) {
      clearTimeout(tempTimer)
    }
  }, [videoUploaded, dots])

  useEffect(() => {
    getRandomNumbers();
  }, [])

  useEffect(() => {
    if (startVerify) {
      const incrementSessions = async () => {
        try {
          const res = await axios.post('http://192.168.1.14:3001/incrementSessions', currentUser)
          setCurrentUser(pre => ({ ...pre, totalSessions: res.data.totalSessions }))
        } catch (error) {
          console.log(error.message);
        }
      }
      incrementSessions()
    }
  }, [startVerify])

  useEffect(() => {
    const changeQuestion = async () => {
      if (randomQuestions.length > 0 && index <= 4 && startVerify) {
        // setQuestion('انتظار فرمائیں')
        setRecordingDisabled(true)
        await playSound(randomQuestions[index].file)
        setQuestion(randomQuestions[index].text)
        setTimeout(() => {
          setRecordingDisabled(false)
        }, 5000);
        // setTimeout(() => {
        // setIsRecording(true)
        // setTimeout(() => {
        //   setIsRecording(false)
        // }, 5000);
        // }, 5000);
      }
    }
    changeQuestion()
  }, [index, startVerify])

  useEffect(() => {
    videoUri && saveVideo()
  }, [videoUri])
  useEffect(() => {
    videoUri && faceRecognize();

  }, [videoUri])

  useEffect(() => {
    videoUri && convertToWav()
  }, [videoUri])

  useEffect(() => {
    const pollInterval = 10000; // 10 seconds

    // Function to check the status of a task ID
    const checkTaskStatus = async (id) => {
      try {
        const response = await axios.get(`http://202.142.147.3:5005/result/${id}`);
        // const response = await axios.get(`https://5b72-121-52-151-227.ngrok-free.app/result/${id}`);

        if (response.data) {
          console.log('Response for ID:', id, response.data);

          // Append unique response to faceResponse
          setFaceResponse(prevResponses => {
            // Create a Map to ensure unique responses based on task_id
            const uniqueResponses = new Map(prevResponses.map(item => [item.id, item]));
            uniqueResponses.set(response.data.id, response.data); // Add the new response

            return Array.from(uniqueResponses.values());
          });

          // Remove the ID from taskIds
          setTaskIds(prevTaskIds => prevTaskIds.filter(taskId => taskId !== id));
        } else {
          console.log('Response not received for ID:', id);
          // Retry after 10 seconds
          setTimeout(() => checkTaskStatus(id), pollInterval);
        }
      } catch (error) {
        // Handle the error based on its status code
        if (error.response && error.response.status === 404) {
          // Log a generic message for 404 errors
          console.log(`No response received for ID: ${id}`);
        } else {
          // Log other errors and retry
          console.error('Error checking task status:', error.message);
        }
        // Retry after 10 seconds
        setTimeout(() => checkTaskStatus(id), pollInterval);
      }
    };

    // Start polling for each task ID
    if (taskIds.length > 0) {
      taskIds.forEach(id => checkTaskStatus(id));
    }

  }, [taskIds]);

  const finalResultCalculation = () => {
    let result = 0;
    // console.log('face Response', faceResponse);
    // console.log('audio Response', audioResponse);


    for (let index = 0; index < faceResponse.length; index++) {
      const face = faceResponse[index];
      const audio = audioResponse[index];
      console.log('face', index, face);
      console.log('audio', index, audio);

      if (audio && audio == currentUser.cnic) {
        result += 10
      }
      if (face.final_result && face.final_result == currentUser.cnic) {
        result += 10;
      }

    }
    setFinalResult(result)
    setQuestion('')
    setVideoUploaded(true)
    console.log('Total Result', result);
    setAudioResponse([])
    setFaceResponse([])
    setTaskIds([])

  }

  useEffect(() => {
    // console.log('Audio Response', audioResponse);
    // console.log('Face Response', faceResponse);

    if (faceResponse.length == 5 && audioResponse.length == 5) {
      finalResultCalculation()

    }

  }, [faceResponse, audioResponse])

  const showAlertWithAnimation = (isSuccess) => {
    Alert.alert(
      'تصدیق کا نتیجہ',
      isSuccess ? '✔️ آپ کامیابی سے تصدیق شدہ ہیں' : '❌ آپ کی تصدیق نہیں ہو سکی',
      [
        {
          text: 'OK',
          onPress: () => setShowAlert(false),
        },
      ],
      { cancelable: true }
    );
    setStartVerify(false);
    setSubmit(null);
    setFinalResult(-1)
    navigation.navigate('Home')
  };

  useEffect(() => {
    if (finalResult >= 90) {
      showAlertWithAnimation(true);
    } else if (finalResult < 90 && finalResult >= 0) {
      showAlertWithAnimation(false);
    }
  }, [finalResult]);



  if (!permission || !micPermission || !mediaPermission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button clickEvent={requestPermission} text={"Grant Camera"} />
      </View>
    );
  }
  if (!micPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to record audio</Text>
        <Button clickEvent={requestMicPermission} text={"Grant Microphone"} />
      </View>
    );
  }
  if (!mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access media</Text>
        <Button clickEvent={requestMediaPermission} text={"Grant Media"} />
      </View>
    );
  }



  async function startRecording() {
    setIsRecording(true)
    if (cameraRef.current) {
      const video = await cameraRef.current.recordAsync();
      setVideoUri(video?.uri);
      // console.log('video', video?.uri);
      // setIsRecording(false)

      // const destinationPath = `${FileSystem.documentDirectory}videos/recordedVideo.mp4`;

      // await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}videos`, { intermediates: true });

      // await FileSystem.moveAsync({
      //   from: video.uri,
      //   to: destinationPath,
      // });

      // Save the video to the gallery
      // await MediaLibrary.saveToLibraryAsync(destinationPath);




    }
  }

  function stopRecording() {
    setIsRecording(false);
    setRecordingDisabled(true)
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
    // index == 4 && setSubmit(true)
  }

  const saveVideo = async () => {
    setQuestion('انتظار فرمائیں')
    setVideoUploaded(false)
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      name: currentUser.cnic + '_' + `${index + 1}` + '_' + currentUser.totalSessions + '.mp4',
      type: 'video/mp4',
    })
    formData.append('cnic', currentUser.cnic)

    try {
      const response = await axios.post('http://192.168.1.14:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response', response.data);

    } catch (error) {
      console.error('Upload error', error);
    }
    setVideoUploaded(true)

  }

  const convertToWav = async () => {

    let formData = new FormData();
    formData.append('files', {
      uri: videoUri,
      type: 'video/mp4',
      name: currentUser.cnic + '_' + `${index + 1}` + '_' + currentUser.totalSessions + '.mp4',
    });
    try {
      let response = await axios.post('http://192.168.1.14:5002/convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'json'
      });

      const { id } = response.data;

      // converted_files.forEach(file => {
      //   console.log(`Converted file: ${file.name}, URI: ${file.uri}`);
      // });
      setAudioResponse(pre => [...pre, id])
      // Alert.alert('Files converted and saved successfully');
    } catch (error) {
      // console.log('Error uploading mp4 file to convert it into wav', error.message);
    }

  }

  const faceRecognize = async () => {

    const formData2 = new FormData();

    // Append the file to the formData object
    formData2.append('video', {

      uri: videoUri, // Ensure the file URI is correct and accessible
      name: 'video.mp4', // The file name
      type: 'video/mp4', // The file type
    });

    try {
      // console.log(videoUri);
      // Send the POST request
      const response = await axios.post('http://202.142.147.3:5005/process',
      // const response = await axios.post('https://5b72-121-52-151-227.ngrok-free.app/process',
        formData2,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'json',
        }
      );

      console.log('Upload response:', response.data);
      setTaskIds((prevTaskIds) => [...prevTaskIds, response.data.task_id]);

    } catch (error) {
      // console.error('Upload error mp4 file :', error);
    }

  }



  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === 4) {
      console.log('Double tap detected!');
      // Your action here
      setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
  };
  return (
    <>
      <View style={styles.container}>
        {startVerify ?
          <>
            <Text style={{ textAlign: 'center', fontSize: 30 }}>{question === 'انتظار فرمائیں' ? question + dots : question}</Text>
            <GestureHandlerRootView
              style={{
                flex: 1, display: cameraDisabled ? 'none' : 'flex'
              }}
            >
              <TapGestureHandler
                onHandlerStateChange={onDoubleTap}
                numberOfTaps={2}
                ref={doubleTapRef}
              >
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                  mode='video'
                  videoQuality='480p'
                >
                  <View style={styles.buttonContainer}>
                    {!submit && !isRecording ?
                      <TouchableOpacity style={styles.button} onPress={() => !recordingDisabled && startRecording()}>
                        <FontAwesome5 name='microphone' style={styles.icon} color={'white'} />
                      </TouchableOpacity>

                      : !submit && <TouchableOpacity style={styles.button} onPress={() => { stopRecording(); }}>
                        <FontAwesome5 name='microphone-slash' style={styles.icon} color={'red'} />
                      </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.flip} onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
                      <FontAwesome5 name='sync-alt' style={{ fontSize: 25 }} color={'white'} />
                    </TouchableOpacity>
                  </View>
                </CameraView>
              </TapGestureHandler>
            </GestureHandlerRootView>
            {/* {
              submit &&
              <Button text={'Submit'} clickEvent={handleSubmit} />
            } */}
            {!isRecording && !submit &&
              <Button text={'تصدیق کا عمل ختم کریں'} clickEvent={() => {
                setStartVerify(false);
                // setWaitingForFaceResponse(''); setWaitingForAudioResponse('')
              }} />

            }
          </>
          : <Button text={timer} clickEvent={() => { setTimer(3); setIndex(0); }} />
        }
      </View >
      {!startVerify && <Footer />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    margin: 20
  },
  camera: {
    flex: 1,
    borderRadius: '50%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  flip: {
    position: 'absolute',
    top: 20,
    right: 20
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    textAlign: 'center'
  },
  icon: {
    fontSize: 28,
    marginBottom: 3,
  },
});

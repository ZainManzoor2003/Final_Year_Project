import React, { useContext, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import Input from '../components/input';
import Button from '../components/button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateContextApi from '../ContextApi/CreateContextApi';
import questions from '../assets/questions'

export default function Login({ navigation }) {
    const [cnic, setCnic] = useState('3520282040461')
    const [password, setPassword] = useState('65tg7qll')
    const { ipAddress, setCurrentUser } = useContext(CreateContextApi);

    const handleLogin = async () => {
        if (!cnic || !password) {
            Alert.alert('Please fill input fields')
            return
        }
        else {
            // if (ipAddress) {
                await axios.post(`http://192.168.100.92:3001/login`, { cnic: cnic, password: password })
                    .then(async (res) => {
                        if (res.data.mes === 'Login Successfully') {
                            setCurrentUser({ name: res.data.user.name, cnic: res.data.user.cnic, totalSessions: res.data.user.sessions.length })
                            // await AsyncStorage.setItem('token', res.data.token)
                            navigation.navigate('Home')
                        }
                        else {
                            Alert.alert(res.data.mes);
                        }
                    })
            // }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>لاگ ان کریں</Text>
            <View style={{ margin: 20 }}>
                <Input text={'شناختی کارڈ نمبر'} setValue={setCnic} value={cnic} maxLength={13} />
                <Input text={'پاس ورڈ'} setValue={setPassword} value={password}/>
            </View>
            <Button text={'لاگ ان'} clickEvent={handleLogin} />
            {/* <Text style={{ textAlign: 'center' }}> Not Registered Please <Text style={{ color: 'red' }} onPress={() => navigation.navigate('Register')}>Register </Text></Text> */}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#e1d5c9'
    },
    pageTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});



import React, { Component, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import Input from '../components/input';
import Button from '../components/button';
import axios from 'axios';

export default function Register({ navigation }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            Alert.alert('Please fill input fields')
            return
        }
        else {
            await axios.post('http://192.168.0.111:3001/register', { name: name, email: email, password: password })
                .then((res) => {
                    if (res.data.mes === 'Account Registered Succesfully') {
                        Alert.alert('confirmation', 'Account Registered Succesfully',
                            [
                                {
                                    text: "OK",
                                    onPress: () => {
                                        navigation.navigate('Login');
                                    }
                                }
                            ],
                            { cancelable: false }
                        )
                    }
                    else {
                        Alert.alert(res.data.mes);
                    }
                })
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Register</Text>
            <View style={{ margin: 20 }}>
                <Input text={'NAME'} value={name} setValue={setName} />
                <Input text={'EMAIL'} value={email} setValue={setEmail} />
                <Input text={'PASSWORD'} value={password} setValue={setPassword} />
            </View>
            <Button text={'Register'} clickEvent={handleSubmit} />
            <Text style={{ textAlign: 'center' }}> Already Registered Please <Text style={{ color: 'red' }} onPress={() => navigation.navigate('Login')}>LOGIN </Text></Text>
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



import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import Footer from '../components/footer'
import axios from 'axios';
import CreateContextApi from '../ContextApi/CreateContextApi';

export default function Account({ navigation }) {
    const { currentUser } = useContext(CreateContextApi)
    const [updateInfo, setUpdateInfo] = useState({
        _id: '',
        name: '',
        username: '',
        password: '',
        number: '',
        address: ''
    })
    useEffect(() => {
        if (currentUser) {
            setUpdateInfo({
                _id: currentUser._id,
                name: currentUser.name,
                username: currentUser.username,
                password: currentUser.password,
                number: currentUser.number,
                address: currentUser.address
            })
        }
    }, [currentUser])

    const handleUpdate = async () => {
        if (!updateInfo.name || !updateInfo.password || !updateInfo.number || !updateInfo.address || !updateInfo.username) {
            Alert.alert('Please fill input fields')
            return
        }
        else {
            await axios.post(`http://192.168.100.92:3001/updateAccount`, updateInfo)
                .then(async (res) => {
                    if (res.data.mes === 'Account updated successfully') {
                        Alert.alert(res.data.mes);
                        navigation.navigate('Login')
                    }
                    else {
                        Alert.alert(res.data.mes);
                    }
                })
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <ScrollView
                contentContainerStyle={{
                    flex: 1 / 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>اکاؤنٹ اپ ڈیٹ کریں</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Feather name="user" size={22} color="#7C808D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="نام"
                            placeholderTextColor="#7C808D"
                            selectionColor="#3662AA"
                            maxLength={13}
                            value={updateInfo.name}
                            onChangeText={(text) => setUpdateInfo((prev) => ({ ...prev, name: text }))}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Feather name="user" size={22} color="#7C808D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="یوزر نیم"
                            placeholderTextColor="#7C808D"
                            selectionColor="#3662AA"
                            maxLength={13}
                            value={updateInfo.username}
                            onChangeText={(text) => setUpdateInfo((prev) => ({ ...prev, username: text }))}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Feather name="phone" size={22} color="#7C808D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="نمبر"
                            placeholderTextColor="#7C808D"
                            selectionColor="#3662AA"
                            maxLength={13}
                            value={updateInfo.number}
                            onChangeText={(text) => setUpdateInfo((prev) => ({ ...prev, number: text }))}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Feather name="map-pin" size={22} color="#7C808D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="پتہ"
                            placeholderTextColor="#7C808D"
                            selectionColor="#3662AA"
                            maxLength={13}
                            value={updateInfo.address}
                            onChangeText={(text) => setUpdateInfo((prev) => ({ ...prev, address: text }))}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Feather name="lock" size={22} color="#7C808D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="پاس ورڈ"
                            placeholderTextColor="#7C808D"
                            selectionColor="#3662AA"
                            secureTextEntry={true}
                            value={updateInfo.password}
                            onChangeText={(text) => setUpdateInfo((prev) => ({ ...prev, password: text }))}
                        />
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={handleUpdate}>
                        <Text style={styles.loginButtonText} >اپ ڈیٹ کریں</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 40,
        textAlign: 'center'
    },
    inputContainer: {
        flexDirection: "row-reverse",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    icon: {
        marginLeft: 15,
    },
    input: {
        borderBottomWidth: 1.5,
        flex: 1,
        paddingBottom: 10,
        borderBottomColor: "#eee",
        fontSize: 16,
        textAlign: 'right'
    },
    forgotPasswordButton: {
        alignSelf: "flex-start",
    },
    forgotPasswordButtonText: {
        color: "#3662AA",
        fontSize: 16,
        fontWeight: "500",
    },
    loginButton: {
        backgroundColor: "#3662AA",
        padding: 14,
        borderRadius: 10,
        marginTop: 20,
    },
    loginButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    }
});
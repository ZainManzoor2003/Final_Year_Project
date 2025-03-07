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
        urduName: '',
        password: '',
        number: '',
        address: ''
    })
    useEffect(() => {
        if (currentUser) {
            setUpdateInfo({
                _id: currentUser._id,
                urduName: currentUser.urduName,
                password: currentUser.password,
                number: currentUser.number,
                address: currentUser.address
            })
        }
    }, [currentUser])
    const validateFields = () => {
        if (updateInfo.number.length < 11) {
            Alert.alert("Number must be 11 digits.");
            return false;
        }
        if (!/[A-Za-z]/.test(updateInfo.address)) {
            Alert.alert("Only Spaces are not allowed.");
            return false;

        }
        if (updateInfo.password.length < 8 || updateInfo.password.length > 13) {
            Alert.alert("Password must be between 8 to 13  characters.");
            return false;
        }

        // Check if password contains only allowed characters and no whitespace
        if (!/^[a-z0-9@_]+$/.test(updateInfo.password)) {
            Alert.alert("Password should contain only lowercase letters, digits, '@', '_', and no whitespace.");
            return false;
        }
    }

    const handleUpdate = async () => {
        if (!updateInfo.urduName || !updateInfo.password || !updateInfo.number || !updateInfo.address) {
            Alert.alert('Please fill input fields')
            return
        }
        if (!validateFields()) return;
        else {
            await axios.post(`https://verification-zeta.vercel.app/updateAccount`, updateInfo)
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
                            maxLength={30}
                            value={updateInfo.urduName}
                            onChangeText={(text) => {
                                const name = text.replace(/[^ا-ی\s]/g, "");
                                setUpdateInfo((prev) => ({ ...prev, urduName: name }))
                            }}
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
                            maxLength={11}
                            value={updateInfo.number}
                            onChangeText={(text) => {
                                const value = text.replace(/[^0-9]/g, "");
                                setUpdateInfo((prev) => ({ ...prev, number: value }))
                            }}
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
                            maxLength={70}
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
                            maxLength={13}
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
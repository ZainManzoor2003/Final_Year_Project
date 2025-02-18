import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CreateContextApi from "../ContextApi/CreateContextApi";
import axios from "axios";

export default function Hello({ navigation }) {
    const [cnic, setCnic] = useState('3520282040461')
    const [password, setPassword] = useState('zain123')
    const { ipAddress,setCurrentUser } = useContext(CreateContextApi);

    const handleLogin = async () => {
        if (!cnic || !password) {
            Alert.alert('Please fill input fields')
            return
        }
        else {
            await axios.post(`http://192.168.100.92:3001/login`, { cnic: cnic, password: password })
                .then(async (res) => {
                    if (res.data.mes === 'Login Successfully') {
                        setCurrentUser(pre => ({
                            ...pre,
                            _id: res.data.user._id,
                            urduName: res.data.user.urduName, cnic: res.data.user.cnic,number: res.data.user.number,
                            password: res.data.user.password, address: res.data.user.address,
                            urduPensionBank: res.data.user.urduPensionBank, urduCity: res.data.user.urduCity,
                            totalSessions: res.data.user.sessions.length
                        }))
                        navigation.navigate('Home')
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
                    <Text style={styles.title}>لاگ ان کریں</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Feather name="credit-card" size={22} color="#7C808D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="شناختی کارڈ نمبر"
                            placeholderTextColor="#7C808D"
                            selectionColor="#3662AA"
                            maxLength={13}
                            value={cnic}
                            onChange={(text) => setCnic(text)}
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
                            value={password}
                            onChange={(text) => setPassword(text)}
                        />
                    </View>
                    <TouchableOpacity style={styles.forgotPasswordButton}>
                        <Text style={styles.forgotPasswordButtonText}>
                            پہلی مرتبہ استعمال کر رہے ہیں.
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText} >لاگ ان</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
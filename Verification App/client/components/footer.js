import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation, useRoute } from '@react-navigation/native'
import CreateContextApi from '../ContextApi/CreateContextApi'
import { Feather } from "@expo/vector-icons";

export default function Footer() {
    const navigation = useNavigation()
    const route = useRoute();
    const { startVerify } = useContext(CreateContextApi);
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn} onPress={() => !startVerify && navigation.navigate('Home')}>
                <Feather name="home" style={styles.icon} color={route.name == 'Home' ? 'orange' :'white'} />
                <Text style={styles.text} >گھر</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Verification')}>
                <Feather name="check-square" style={styles.icon} color={route.name == 'Verification' ? 'orange' :'white'} />
                <Text style={styles.text}> تصدیق کریں</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => !startVerify && navigation.navigate('Account')}>
                <Feather name="user" style={styles.icon} color={route.name == 'Account' ? 'orange' :'white'} />
                <Text style={styles.text}>اکاؤنٹ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => !startVerify && navigation.navigate('Login')}>
                <Feather name="log-out" style={styles.icon} color={route.name == 'About' ? 'orange' :'white'} />
                <Text style={styles.text}>لاگ آؤٹ</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        // borderTopWidth:2,
        // borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor:'#3662AA',
        alignSelf: 'center',
        // marginBottom: 10,
        // marginTop:10,
    },
    btn: {
        marginHorizontal: 15,
        alignItems: 'center'
    },
    icon: {
        fontSize: 22,
        alignSelf: 'center',
        marginBottom: 3,
        // color: "#7C808D",
    },
    text: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'Noto Nastaliq Urdu',
    }
})
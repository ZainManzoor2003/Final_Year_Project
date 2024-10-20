import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation, useRoute } from '@react-navigation/native'
import CreateContextApi from '../ContextApi/CreateContextApi'

export default function Footer() {
    const navigation = useNavigation()
    const route = useRoute();
    const {startVerify}=useContext(CreateContextApi);
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn} onPress={() => !startVerify && navigation.navigate('Home')}>
                <FontAwesome5 name='home' style={styles.icon} color={route.name == 'Home' && 'orange'} />
                <Text style={styles.text} >گھر</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Verification')}>
                <FontAwesome5 name='check-double' style={styles.icon} color={route.name == 'Verification' && 'orange'} />
                <Text style={styles.text}> تصدیق کریں</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => !startVerify && navigation.navigate('About')}>
                <FontAwesome5 name='info-circle' style={styles.icon} color={route.name == 'About' && 'orange'} />
                <Text style={styles.text}>اباؤٹ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => !startVerify && navigation.navigate('Account')}>
                <FontAwesome5 name='user' style={styles.icon} color={route.name == 'Account' && 'orange'} />
                <Text style={styles.text}>اکاؤنٹ</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        // borderTopWidth:2,
        borderColor: 'black',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white'
    },
    btn: {
        marginHorizontal: 15,
    },
    icon: {
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 3,
    },
    text: {
        color: 'black',
        fontSize: 12,
    }
})
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Input({ maxLength, text, value, setValue }) {
    return (
        <View>
            <Text style={styles.text}>{text}</Text>
            <TextInput
                style={styles.input} maxLength={maxLength} value={value} onChangeText={(text) => setValue(text)}
                secureTextEntry={text=='پاس ورڈ' && true}>
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'right',
        fontFamily: 'Noto Nastaliq Urdu',
        marginBottom:10
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,
        textAlign: 'right'
    },
})
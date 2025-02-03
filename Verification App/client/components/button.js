import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Button({text,clickEvent}) {
    return (
        <View style={{marginHorizontal:20}}>
            <TouchableOpacity style={styles.submitBtn} onPress={clickEvent}>
                <Text style={styles.btn}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    submitBtn: {
        height: 50,
        backgroundColor: '#1e2225',
        borderRadius: 50,
        justifyContent: 'center',
        marginBottom: 20,
    },
    btn: {
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
        fontWeight: '500',
        fontFamily: 'Noto Nastaliq Urdu'
    }
});



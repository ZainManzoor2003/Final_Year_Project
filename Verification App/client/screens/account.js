import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Footer from '../components/footer'

export default function Account({ navigation }) {
    return (
        <>
            <View style={styles.container}>
                <Text>Go back To <Text style={{ color: 'red' }} onPress={() => navigation.navigate('Login')}>LOGIN</Text></Text>
            </View>
            <Footer />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'space-between',
    }
})
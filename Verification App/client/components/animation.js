import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Animation = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../assets/splash.png')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    image: {
        width: '80%',
        height: '60%',
    },
});

export default Animation;

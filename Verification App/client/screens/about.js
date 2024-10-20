import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Footer from '../components/footer'

export default function About() {
  return (
    <>
      <View style={styles.container}>
        <Text>About</Text>
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
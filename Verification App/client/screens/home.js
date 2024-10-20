import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Footer from '../components/footer'
import Animation from '../components/animation'
import CreateContextApi from '../ContextApi/CreateContextApi'
import questions from '../assets/questions'
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native'

export default function Home() {
  const { playSound } = useContext(CreateContextApi)
  useEffect(() => {
    playSound(questions[0].file);
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );


  return (
    <View style={styles.container}>
      <Animation />
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  }
})
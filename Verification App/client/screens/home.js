import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Footer from '../components/footer'
import Animation from '../components/animation'
import CreateContextApi from '../ContextApi/CreateContextApi'
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native'
import getQuestions from '../assets/questions'

export default function Home() {
  const { playSound } = useContext(CreateContextApi)
  useEffect(() => {
    const question = getQuestions()
    const startingVoice = question[0].file
    playSound(startingVoice);
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
    backgroundColo: 'red'
  }
})
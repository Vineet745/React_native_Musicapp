import { View, Text, StyleSheet,StatusBar } from 'react-native'
import React from 'react'
import MusicPlayer from './screens/MusicPlayer'

const App = () => {
  return (
    <View style={style.container}>
      <StatusBar barstyle="light-content"/>
      <MusicPlayer/>
    </View>
  )
}

const style = StyleSheet.create({
  container:{
    flex:1,
  }
})

export default App
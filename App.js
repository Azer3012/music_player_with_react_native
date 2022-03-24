import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MusicPlayer from './screens/MusicPlayer'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UploadMusic from './screens/UploadMusic'



const Stack=createNativeStackNavigator()
const App = () => {


  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator  screenOptions={{headerShown:false}}>
          <Stack.Screen name="Home" component={MusicPlayer}/>
          <Stack.Screen name="Upload" component={UploadMusic}/>
        </Stack.Navigator>
      </NavigationContainer>
    
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})
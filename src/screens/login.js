import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity
} from 'react-native'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Configure Google SignIn
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '49476995375-gko8935aoabfglgijlhhsip1gl58e2lv.apps.googleusercontent.com',
    })
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }
    setLoading(true)
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password)
      const user = userCredential.user
      Alert.alert('Success', `Welcome back, ${user.email}!`)
      setEmail('')
      setPassword('')
      setLoading(false)
// In handleLogin and handleGoogleLogin functions:
    } catch (error) {
      setLoading(false)
      console.log('Login error:', error)
      switch (error.code) {
        case 'auth/user-not-found':
          Alert.alert('User not found', 'Please check your email and try again.')
          break
        case 'auth/wrong-password':
          Alert.alert('Incorrect password', 'Please check your password and try again.')
          break
        default:
          Alert.alert('Login Error', error.message)
          break
      }
    }
  }

  // Login with Google
  const handleGoogleLogin = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn() // Get ID Token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken) // Create Google Credential
      const userCredential = await auth().signInWithCredential(googleCredential) // Sign in with credential
      const user = userCredential.user
      Alert.alert('Success', `Welcome back, ${user.email}!`)
      navigation.navigate("MainApp")
    } catch (error) {
      console.log('Google Login Error:', error)
      Alert.alert('Google Login Error', error.message)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Login Screen</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={{ marginVertical: 10 }}>
        <Button title="Login with Google" onPress={handleGoogleLogin} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('signup')}>
        <Text style={{ marginTop: 20, color: 'blue', textAlign: 'center' }}
        onPress={()=>navigation.navigate('Signup')}
        >
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen
import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { navigate } from '../navigation/navigationRef';
import { View, ActivityIndicator } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      console.log('firebaseUser:', firebaseUser); // Check if firebaseUser is null or has data
      if (firebaseUser) {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .get();
  
          if (userDoc.exists) {
            const userData = userDoc.data();
  
            const mergedUser = {
              uid: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || '',
              email: firebaseUser.email,
              photo: userData.photo || firebaseUser.photoURL || '',
              nationality: userData.nationality || '',
              gender: userData.gender || '',
            };
  
            setUser(mergedUser);
            await AsyncStorage.setItem('user', JSON.stringify(mergedUser));
          } else {
            const fallbackUser = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email,
              photo: firebaseUser.photoURL || '',
              nationality: '',
              gender: '',
            };
  
            setUser(fallbackUser);
            await AsyncStorage.setItem('user', JSON.stringify(fallbackUser));
          }
  
          console.log('Navigating to Loader'); // Add a log to check navigation
          navigate('MainApp');
        } catch (error) {
          console.error('Firestore fetch error:', error);
          navigate('Login');
        }
      } else {
        console.log('No user, navigating to Login');
        setUser(null);
        await AsyncStorage.removeItem('user');
        navigate('Login');
      }
  
      if (initializing) setInitializing(false);
    });
  
    return unsubscribe;
  }, []);
  

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

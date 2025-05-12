import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AuthContext } from '../context/Authcontext';
import Navbar from '../components/navbar';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.container}>
        <Navbar/>
        <Text style={styles.message}>No user data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Navbar/>
      <Image
        source={{ uri: user.photo || 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{user.name || 'No name'}</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
      <Text style={styles.info}>Nationality: {user.nationality || 'Not set'}</Text>
      <Text style={styles.info}>Gender: {user.gender || 'Not set'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2,
  },
  message: {
    fontSize: 18,
    marginTop: 20,
    color: 'red',
  },
});

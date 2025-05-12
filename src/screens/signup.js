import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    data.append('upload_preset', 'socialmedia'); // your Cloudinary preset
    data.append('cloud_name', 'dudx3of1n'); // your Cloudinary cloud name

    const res = await fetch('https://api.cloudinary.com/v1_1/dudx3of1n/image/upload', {
      method: 'POST',
      body: data,
    });

    const file = await res.json();
    return file.secure_url;
  };

  const handleSignup = async () => {
    if (!email || !password || !name || !gender || !nationality) {
      return Alert.alert('Please fill all fields');
    }

    setUploading(true);

    try {
      // 1. Create user with email/password
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      // 2. Upload image to Cloudinary
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      // 3. Save user profile in Firestore
      await firestore().collection('users').doc(uid).set({
        email,
        name,
        gender,
        nationality,
        photo: imageUrl,
      });

      Alert.alert('Signup Successful!');
    } catch (error) {
      console.log('Signup Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Signup</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Nationality"
        value={nationality}
        onChangeText={setNationality}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />

      <Button title="Pick Profile Image" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, marginTop: 10, borderRadius: 50 }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={uploading ? 'Signing up...' : 'Signup'}
          onPress={handleSignup}
          disabled={uploading}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 20, color: 'blue' }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

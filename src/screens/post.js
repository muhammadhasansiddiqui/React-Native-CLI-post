import React, { useState, useContext } from "react";
import { View, Text, Button, Image, Alert, TextInput, StyleSheet } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { AuthContext } from "../context/Authcontext";
import Navbar from "../components/navbar";
import firestore from '@react-native-firebase/firestore';

export default function PostScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    data.append("upload_preset", "socialmedia"); // your Cloudinary preset
    data.append("cloud_name", "dudx3of1n"); // your Cloudinary cloud name

    setUploading(true);

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dudx3of1n/image/upload", {
        method: "POST",
        body: data,
      });

      const file = await res.json();
      const imageUrl = file.secure_url;
      setUploading(false);

      return imageUrl; // Return the uploaded image URL
    } catch (error) {
      setUploading(false);
      Alert.alert("Error", "Image upload failed");
      console.error("Upload error:", error);
      return null;
    }
  };

  const handelpost = async () => {
    if (!description.trim() && !image) {
      Alert.alert("Please select an image and add a description");
      return;
    }

    setUploading(true);

    try {
      const uid = user?.uid;
      const username = user?.name;
      const userpic = user?.photo;

      // 1. Ensure the user exists
      if (!uid || !username || !userpic) {
        setUploading(false);
        Alert.alert("User not found", "Please log in again");
        return;
      }

      // 2. Upload image to Cloudinary and get the image URL
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadToCloudinary(image); // Wait for image upload to complete
      }

      if (!imageUrl) {
        Alert.alert("Error", "Failed to upload the image");
        return;
      }

      // 3. Save the post data to Firestore
      await firestore().collection('posts').doc(uid).set({
        description: description,
        username: username,
        post: imageUrl,
        userpic: userpic,
      });

      Alert.alert("Success", "Post uploaded successfully");
      setImage(null); // Reset image after posting
      setDescription(""); // Reset description after posting

    } catch (error) {
      console.log("Post Error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false); // Always stop uploading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text style={styles.header}>Upload an Image</Text>

        {/* Pick image button */}
        <Button title="Pick Profile Image" onPress={pickImage} />

        {/* Display selected image */}
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        )}

        {/* Description input */}
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter a description..."
          style={styles.input}
          multiline
        />

        {/* Show loading indicator while uploading */}
        {uploading && <Text style={styles.uploading}>Uploading...</Text>}

        {/* Post button that triggers the upload and post */}
        <Button title="POST" onPress={handelpost} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 20,
    borderRadius: 75,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    padding: 8,
    marginBottom: 20,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlignVertical: "top", // To align text at the top of the TextInput
  },
  uploading: {
    fontSize: 16,
    color: "blue",
    marginTop: 10,
  },
});

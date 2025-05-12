import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Navbar from '../components/navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logout Handler
  const handleSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while signing out.');
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('posts')
      .onSnapshot(snapshot => {
        // Check if there are any posts in the collection
        if (!snapshot.empty) {
          const fetchedPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts); // Update state with the fetched posts
          console.log('Posts fetched:', fetchedPosts);
          setLoading(false); // Set loading to false after fetching posts
        } else {
          console.log('No posts found in Firestore.');
          setLoading(false); // Set loading to false if no posts are found
        }
      }, error => {
        console.error('Error fetching posts:', error);
        setLoading(false); // Set loading to false in case of an error
      });
  
    // Cleanup function to unsubscribe when the component unmounts or when the effect is re-run
    return () => unsubscribe();
  }, []);
  


  // Render Each Post
  const renderPost = ({ item }) => {
    const userName = item.username || 'Unknown User';
    const userPhoto =
      item.userpic ||
      'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    const postImage =
      item.post || 'https://via.placeholder.com/300x200?text=No+Image';
    const description = item.description || 'No description provided.';

    return (
      <View style={styles.postCard}>
        <View style={styles.userInfo}>
          <Image source={{ uri: userPhoto }} style={styles.userImage} />
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <Image source={{ uri: postImage }} style={styles.postImage} />
        <Text style={styles.description}>{description}</Text>
      </View>
    );
  };

  // Conditional rendering while posts are being fetched
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>All Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});

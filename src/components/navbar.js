// components/Navbar.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../navigation/navigationRef';
import { AuthContext } from '../context/Authcontext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation(); // Only for drawer

  const openDrawer = () => {
    navigation.openDrawer(); // This works only inside screens in a drawer navigator
  };


  return (
    <View style={styles.navbar}>
      {/* Left: Drawer Button */}
      <TouchableOpacity onPress={openDrawer}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      {/* Center: Title */}
      <Text style={styles.title}>{user?.name  || 'welcome'}</Text>

      {/* Right: Plus Button & Profile Image */}
      <View style={styles.rightItems}>
        <TouchableOpacity onPress={()=>navigate('Post')}>
          <Text style={styles.plusIcon}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('Profile')}>
          <Image
            source={{ uri: user?.photo || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    elevation: 5,
    zIndex: 10,
  },
  menuText: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  rightItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  plusIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
  },
});

export default Navbar;

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';
import PostScreen from '../screens/post';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeScreen}/>
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Post" component={PostScreen} />
  </Drawer.Navigator>
);

export default DrawerNavigator;

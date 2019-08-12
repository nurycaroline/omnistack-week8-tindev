import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, SafeAreaView, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import dislike from '../assets/dislike.png';
import like from '../assets/like.png';

export default function Main({ navigation }) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id
        }
      });
      setUsers(response.data);
    }

    loadUsers();
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users;
    console.log(id)

    await api.post(`/devs/${user._id}/likes`, null, {
        headers: { user: id }
    });

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id }
    });

    setUsers(rest);
  }

  async function handleLogout(){
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {users.length === 0
          ? <Text style={styles.empty}> Acabou :( </Text>
          : ( 
            users.map((user, index) => (
              <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
                <Image style={styles.avatar} source={{uri: user.avatar}} />
                <View style={styles.footer}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.bio}>{user.bio}</Text>
                </View>
              </View> 
            ))
          )}
      </View>

      {
        users.length > 0 && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleDislike} style={styles.button}>
              <Image source={dislike} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLike} style={styles.button}>
              <Image source={like} />
            </TouchableOpacity>
          </View>
        )
      }
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  logo: {
      marginTop: 30
  },
  empty: {
    alignSelf: 'center',
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
},
  cardsContainer: {
      flex: 1,
      alignSelf: 'stretch',
      justifyContent: 'center',
      maxHeight: 500
  },
  card: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      margin: 38,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333'
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18
  },

    buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2, 
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
});
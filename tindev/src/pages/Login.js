import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { 
  KeyboardAvoidingView, 
  Platform,
  Image, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import logo from '../assets/logo.png';
import api from '../services/api';

export default function Login({ navigation }) {
  const [user, setUser] = useState('');

  useEffect(()=>{
    AsyncStorage.getItem('user').then(user => {
      if(user){
        navigation.navigate('Main', { user });
      }
    })
  }, []);
  
  async function handleLogin(){
    const response = await api.post('/devs', {
      username: user
    });

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id )

    navigation.navigate('Main', { user: _id });
  }

  return (
    <KeyboardAvoidingView 
      behavior="padding"
      enable={Platform.OS === 'ios'}
      style={styles.container}
    >
      
      <Image source={logo} />
      
      <TextInput 
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#999" 
        placeholder="Digite seu usuário no Github" 
        style={styles.input} 
        value={user}
        onChangeText={setUser}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.buttom}>
        <Text style={styles.buttomText}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius:4,
    marginTop:20,
    paddingHorizontal: 15
  },
  buttom: {
    height:46,
    alignSelf: 'stretch',
    backgroundColor: '#df4723',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttomText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },
})
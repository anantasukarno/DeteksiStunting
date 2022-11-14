import { Text, View, StyleSheet, TextInput, TouchableOpacity, Picker, Alert } from 'react-native'
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue, update } from "firebase/database";




export class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      level: '',
      hidePassword: true,
      data: [],
      key: ''
    }

  }
  
  async onLogin(){
    if (!this.state.email || !this.state.password) {
      Alert.alert('Perhatian', 'Isi formulir dengan benar')
    }
    else{
      await AsyncStorage.setItem('email', this.state.email)
      await AsyncStorage.setItem('password', this.state.password)
      // console.log(await AsyncStorage.getItem('email'))
    }
  }

  render() {
    const {login} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text1}>Masuk ke akun anda!</Text>
        <TextInput 
          style={styles.textInput}
          value={this.state.email}
          onChangeText={(text) => this.setState({email: text})}
          placeholder="Email"
        ></TextInput>
        <View>
          <TextInput 
            style={styles.textInput}
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
            placeholder="Password"
            secureTextEntry={this.state.hidePassword}
          ></TextInput>
          {this.state.hidePassword &&
            <TouchableOpacity style={styles.wrapperIconPassword} onPress={() => this.setState({hidePassword: !this.state.hidePassword})}>
              <FontAwesomeIcon icon={ faEyeSlash } style={styles.iconPassword} />
            </TouchableOpacity>
          }
          {!this.state.hidePassword &&
            <TouchableOpacity style={styles.wrapperIconPassword} onPress={() => this.setState({hidePassword: !this.state.hidePassword})}>
              <FontAwesomeIcon icon={ faEye } style={styles.iconPassword} />
            </TouchableOpacity>
          }
        </View>
        {/* <View style={styles.picker}>
                <Picker
                    selectedValue={this.state.level}
                    onValueChange={(itemValue, itemIndex) => this.setState({...this.state, level: itemValue})}
                    style={styles.pickerChild}
                >
                    <Picker.Item label="Login sebagai..." value="0" />
                    <Picker.Item label="Admin" value="admin" />
                    <Picker.Item label="Anggota" value="anggota" />
                </Picker>
        </View> */}
        <TouchableOpacity style={styles.tombolLogin} onPress={()=>{ this.onLogin(); login()}}>
          <Text style={styles.textTombolLogin}>Login</Text>
        </TouchableOpacity>
        <View style={styles.wrapperDaftar}>
          <Text style={styles.text2}>Belum punya akun? </Text>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Register')}>
            <Text style={styles.text3}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  text1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#444',
    marginLeft: 5,
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 7,
    marginTop: 10,
    fontFamily: 'Poppins-Reg'
  },
  wrapperIconPassword: {
    position: 'absolute',
    right: 20,
    top: 25,
  },
  iconPassword: {
    color: '#444'
  },
  tombolLogin: {
    backgroundColor: '#5669ff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 20,
  },
  textTombolLogin: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  picker: {
    color: '#444',
    backgroundColor: '#fff',
    borderRadius: 7,
    marginTop: 10,
    paddingHorizontal: 7,
  },
  pickerChild: {
    color: '#444'
  },
  wrapperDaftar: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50,
  },
  text2: {
    fontFamily: 'Poppins-Reg',
    color: '#999'
  },
  text3: {
    fontFamily: 'Poppins-Reg',
    color: '#5669ff'
  }
})

export default Login
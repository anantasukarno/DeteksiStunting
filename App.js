// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStackAdmin, HomeStackUser, AuthStack, HomeStackPetugas } from './router';
import { useFonts } from 'expo-font';
import { app } from './config/FIREBASE'
import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { BelumDisetujui } from './pagesPetugas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue, update } from "firebase/database";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Welcome, Home, TambahPertumbuhan, DaftarAnggota, HitungCepat, Hasil, DetailAnggota, TambahAnggota, PermohonanAnggota, Login, Register, DaftarPetugas, DetailPetugas, DaftarStunting, UbahAnggota} from './pagesPetugas'

import { HomeAdmin, DaftarPetugasAdmin, TambahPetugasAdmin, DaftarAdmin, TambahAdmin, DetailPetugasAdmin, UbahPetugasAdmin, DetailAdmin, UbahAdmin} from './pagesAdmin';
import { HomeAnggota, Kuisioner, TentangStunting, PersebaranStunting, HasilTes, Info, RiwayatPertumbuhan} from './pagesAnggota';

import { Base64 } from 'js-base64';


const StackAdmin = createNativeStackNavigator();
const StackPetugas = createNativeStackNavigator();
const StackUser = createNativeStackNavigator();
const StackBelumDisetujui = createNativeStackNavigator();
const Auth = createNativeStackNavigator();

export default function App() {

  const [isSigned, setIsSigned] = useState(null)
  const [level, setLevel] = useState('')
  const [isDisetujui, setIsDisetujui] = useState(false)
  const [data, setData] = useState({})
  const [isLoad, setIsLoad] = useState(true)

  const getData = async () => {
    const email = await AsyncStorage.getItem('email')
    const password = await AsyncStorage.getItem('password')

  }

  
  const checkIsLogin = async () => {
    try {
      let findingToken = await AsyncStorage.getItem('isSigned');
      setIsSigned(findingToken);
      const email = await AsyncStorage.getItem('email')
      let password = await AsyncStorage.getItem('password')
      console.log(isSigned)
      try{
        if(email == null){
          await getData();
        }
        else{
          const dbRef = ref(getDatabase());
          const db = getDatabase()
          const refAnggota = query(ref(db, "users"), orderByChild("email"), equalTo(email))
          onValue(refAnggota, async (snapshot) => {
            if(snapshot.val() != null){
                
              const dataUser = await snapshot.val()
              const key = Object.keys(dataUser)
              const index = key.toString()
                  
              password = Base64.encode(password);
              if(password == dataUser[index].password){
                await AsyncStorage.setItem('isSigned', 'ok');
                if (dataUser[index].level == 'admin') {
                  setIsSigned(true)
                  setLevel('admin')
                  }
                else if (dataUser[index].level == 'petugas') {
                  setIsSigned(true)
                  setLevel('petugas')
                }
                else{
                  if (dataUser[index].status == 'disetujui') {
                    setIsSigned(true)
                    setIsDisetujui(true)
                    setLevel('anggota')
                  }
                  else{
                    setIsSigned(true)
                    setIsDisetujui(false)
                    setLevel('anggota')
                  }
                }
              }
                    
            }
                  
          }, {
            onlyOnce: true
          });
  
        }
        
      }catch(err){
        console.log(error);
      }
    
    } catch (error) {
      console.log(error);
    }
  }

  

  const loginAction = async () => {
    const email = await AsyncStorage.getItem('email')
    let password = await AsyncStorage.getItem('password')
    try{
      if (email == null) {
        await getData();
      } else {
        const dbRef = ref(getDatabase());
        const db = getDatabase()
        const refAnggota = query(ref(db, "users"), orderByChild("email"), equalTo(email))
        onValue(refAnggota, async (snapshot) => {
          if (snapshot.val() != null) {
            const dataUser = await snapshot.val()
            const key = Object.keys(dataUser)
            const index = key.toString()
            password = Base64.encode(password);

            if (password == dataUser[index].password) {
              await AsyncStorage.setItem('isSigned', 'ok');
              await AsyncStorage.setItem('idUser', dataUser[index].id);
              await AsyncStorage.setItem('level', dataUser[index].level);

              if (dataUser[index].level == 'admin') {
                setIsSigned(true)
                setLevel('admin')
              } else if (dataUser[index].level == 'petugas') {
                setIsSigned(true)
                setLevel('petugas')
              } else {
                if (dataUser[index].status == 'disetujui') {
                  setIsSigned(true)
                  setIsDisetujui(true)
                  setLevel('anggota')
                } else {
                  setIsSigned(false)
                  setIsDisetujui(false)
                  setLevel('anggota')
                }
              }
            } else {
              Alert.alert('Gagal', 'Password Salah')
            }
          } else {
            Alert.alert('Gagal', 'Akun tidak ditemukan')
          }
        }, {
          onlyOnce: true
        });

      }
      
    }catch(err){
      console.log(error);
    }
  }
  
  const logoutAction = async () => {
    await AsyncStorage.clear();
    let findingToken = await AsyncStorage.getItem('isSigned');
    setIsSigned(findingToken)
  }

  useEffect(async () => {
    setTimeout(()=> {
      setIsLoad(false)
    }, 2000)
    checkIsLogin();
    
  }, []);

  let [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Reg': require('./assets/fonts/Poppins-Regular.ttf'),
    'Montserrat-Reg': require('./assets/fonts/Montserrat-Regular.otf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.otf'),
  });
  if(isLoad){
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading</Text>
      </View>
    )
  }
  else{
  if (isSigned != null){
    if(level == 'admin'){
      return(
      <NavigationContainer>
          <StackAdmin.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <StackAdmin.Screen name="Home" options={{headerShown: false, title: 'Home Admin'}}>
                    {props => <HomeAdmin {...props} logout={() => logoutAction()} />}
                </StackAdmin.Screen>
                <StackAdmin.Screen name="DaftarPetugasAdmin" component={DaftarPetugasAdmin} options={{headerShown: false}}/>
                <StackAdmin.Screen name="TambahPetugasAdmin" component={TambahPetugasAdmin} options={{headerShown: false}}/>
                <StackAdmin.Screen name="DaftarAdmin" component={DaftarAdmin} options={{headerShown: false}}/>
                <StackAdmin.Screen name="TambahAdmin" component={TambahAdmin} options={{headerShown: false}}/>
                <StackAdmin.Screen name="DetailPetugasAdmin" component={DetailPetugasAdmin} options={{headerShown: false}}/>
                <StackAdmin.Screen name="UbahPetugasAdmin" component={UbahPetugasAdmin} options={{headerShown: false}}/>
                <StackAdmin.Screen name="UbahAdmin" component={UbahAdmin} options={{headerShown: false}}/>
                <StackAdmin.Screen name="DetailAdmin" component={DetailAdmin} options={{headerShown: false}}/>
            </StackAdmin.Navigator>
      </NavigationContainer>
      )
    }
    else if(level == 'petugas'){
      return(
      <NavigationContainer>
          <StackPetugas.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <StackPetugas.Screen name="Home" options={{headerShown: false, title: 'Home Petugas'}}>
                    {props => <Home {...props} logout={() => logoutAction()} />}
                </StackPetugas.Screen>
                <StackPetugas.Screen name="TambahPertumbuhan" component={TambahPertumbuhan} options={{headerShown: false}}/>
                <StackPetugas.Screen name="DaftarAnggota" component={DaftarAnggota} options={{headerShown: false}}/>
                <StackPetugas.Screen name="DaftarPetugas" component={DaftarPetugas} options={{headerShown: false}}/>
                <StackPetugas.Screen name="Hasil" component={Hasil} options={{headerShown: false, title: 'Hasil Perhitungan'}}/>
                <StackPetugas.Screen name="HitungCepat" component={HitungCepat} options={{headerShown: false}}/>
                <StackPetugas.Screen name="TambahAnggota" component={TambahAnggota} options={{headerShown: false}}/>
                <StackPetugas.Screen name="PermohonanAnggota" component={PermohonanAnggota} options={{headerShown: false}}/>
                <StackPetugas.Screen name="DetailAnggota" component={DetailAnggota} options={{headerShown: true, title: 'Detail Anggota'}}/>
                <StackPetugas.Screen name="DetailPetugas" component={DetailPetugas} options={{headerShown: true, title: 'Detail Petugas'}}/>
                <StackPetugas.Screen name="DaftarStunting" component={DaftarStunting} options={{headerShown: true, title: 'Detail Petugas'}}/>
                <StackPetugas.Screen name="UbahAnggota" component={UbahAnggota} options={{headerShown: true, title: 'Ubah Anggota Petugas'}}/>
                <StackPetugas.Screen name="KenaliStunting" component={TentangStunting} options={{headerShown: false, title: 'Ubah Anggota Petugas'}}/>
                <StackPetugas.Screen name="Persebaran" component={PersebaranStunting} options={{headerShown: false, title: 'Ubah Anggota Petugas'}}/>
            </StackPetugas.Navigator>
      </NavigationContainer>
      )
    }
    else{
      if (isDisetujui) {
        return (
          <NavigationContainer>
            <StackUser.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <StackUser.Screen name="HomeAnggota" options={{headerShown: false, title: 'Home User'}}>
                    {props => <HomeAnggota {...props} logout={() => logoutAction()} />}
                </StackUser.Screen>
                <StackUser.Screen name="Kuisioner" component={Kuisioner} options={{headerShown: false}}/>
                <Auth.Screen name="HitungCepat" component={HitungCepat} options={{headerShown: false}}/>
                <StackUser.Screen name="Hasil" component={Hasil} options={{headerShown: true, title: 'Hasil Perhitungan'}}/>
                <StackUser.Screen name="TentangStunting" component={TentangStunting} options={{headerShown: false}}/>
                <StackUser.Screen name="PersebaranStunting" component={PersebaranStunting} options={{headerShown: false, title: 'Detail Anggota'}}/>
                <StackUser.Screen name="HasilTes" component={HasilTes} options={{headerShown: false, title: 'Detail Anggota'}}/>
                <StackUser.Screen name="Info" component={Info} options={{headerShown: false, title: 'Detail Anggota'}}/>
                <StackUser.Screen name="RiwayatPertumbuhan" component={RiwayatPertumbuhan} options={{headerShown: false, title: 'Detail Anggota'}}/>
            </StackUser.Navigator>
          </NavigationContainer>
        );
      }
      else{
        return (
          <NavigationContainer>
            <StackBelumDisetujui.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <StackBelumDisetujui.Screen name="BelumDisetujui" options={{headerShown: false, title: 'Belum User'}}>
                    {props => <BelumDisetujui {...props} logout={() => logoutAction()} />}
                </StackBelumDisetujui.Screen>
            </StackBelumDisetujui.Navigator>
          </NavigationContainer>
        )
      }
    }
  }
  else{
    return (
      <NavigationContainer>
        <Auth.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <Auth.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
                <Auth.Screen name="Login" options={{headerShown: false}}>
                  {props => <Login {...props} login={() => loginAction()} />}
                </Auth.Screen>
                <Auth.Screen name="Hasil" component={Hasil} options={{headerShown: false, title: 'Hasil Perhitungan'}}/>
                <Auth.Screen name="HitungCepat" component={HitungCepat} options={{headerShown: false}}/>
                <Auth.Screen name="Kenali" component={TentangStunting} options={{headerShown: false}}/>
                <Auth.Screen name="Persebaran" component={PersebaranStunting} options={{headerShown: false}}/>
                <Auth.Screen name="Register" component={Register} options={{headerShown: false}}/>
                <Auth.Screen name="Kuisioner" component={Kuisioner} options={{headerShown: false}}/>
                <StackUser.Screen name="HasilTes" component={HasilTes} options={{headerShown: false, title: 'Detail Anggota'}}/>
                
        </Auth.Navigator>
      </NavigationContainer>
    )
  }
}
}



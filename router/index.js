import React, { Component } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Welcome, Home, TambahPertumbuhan, DaftarAnggota, HitungCepat, Hasil, DetailAnggota, TambahAnggota, PermohonanAnggota, Login} from '../pagesPetugas'

import AsyncStorage from '@react-native-async-storage/async-storage';


const StackAdmin = createNativeStackNavigator();
const StackPetugas = createNativeStackNavigator();
const StackUser = createNativeStackNavigator();
const Auth = createNativeStackNavigator();

const logoutAction = async () => {
    await AsyncStorage.clear();
}

export class HomeStackAdmin extends Component {
    render(){
        return (
            <StackAdmin.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <StackAdmin.Screen name="Home" options={{headerShown: true, title: 'Home Admin'}}>
                    {props => <Home {...props} logout={() => logoutAction()} />}
                </StackAdmin.Screen>
                <StackAdmin.Screen name="TambahPertumbuhan" component={TambahPertumbuhan} options={{headerShown: false}}/>
                <StackAdmin.Screen name="DaftarAnggota" component={DaftarAnggota} options={{headerShown: false}}/>
                <StackAdmin.Screen name="Hasil" component={Hasil} options={{headerShown: true, title: 'Hasil Perhitungan'}}/>
                <StackAdmin.Screen name="HitungCepat" component={HitungCepat} options={{headerShown: false}}/>
                <StackAdmin.Screen name="TambahAnggota" component={TambahAnggota} options={{headerShown: false}}/>
                <StackAdmin.Screen name="PermohonanAnggota" component={PermohonanAnggota} options={{headerShown: false}}/>
                <StackAdmin.Screen name="DetailAnggota" component={DetailAnggota} options={{headerShown: true, title: 'Detail Anggota'}}/>
            </StackAdmin.Navigator>
        );
    }
  }
export class HomeStackPetugas extends Component {
    render(){
        return (
            <StackPetugas.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <StackPetugas.Screen name="Home" component={Home} options={{headerShown: true, title: 'Home Petugas'}}/>
                <StackPetugas.Screen name="TambahPertumbuhan" component={TambahPertumbuhan} options={{headerShown: false}}/>
                <StackPetugas.Screen name="DaftarAnggota" component={DaftarAnggota} options={{headerShown: false}}/>
                <StackPetugas.Screen name="Hasil" component={Hasil} options={{headerShown: true, title: 'Hasil Perhitungan'}}/>
                <StackPetugas.Screen name="HitungCepat" component={HitungCepat} options={{headerShown: false}}/>
                <StackPetugas.Screen name="TambahAnggota" component={TambahAnggota} options={{headerShown: false}}/>
                <StackPetugas.Screen name="PermohonanAnggota" component={PermohonanAnggota} options={{headerShown: false}}/>
                <StackPetugas.Screen name="DetailAnggota" component={DetailAnggota} options={{headerShown: true, title: 'Detail Anggota'}}/>
            </StackPetugas.Navigator>
        );
    }
  }
export class HomeStackUser extends Component {
    render(){
        return (
            <StackUser.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <StackUser.Screen name="Home" component={Home} options={{headerShown: false, title: 'Home User'}}/>
                <StackUser.Screen name="TambahPertumbuhan" component={TambahPertumbuhan} options={{headerShown: false}}/>
                <StackUser.Screen name="DaftarAnggota" component={DaftarAnggota} options={{headerShown: false}}/>
                <StackUser.Screen name="Hasil" component={Hasil} options={{headerShown: true, title: 'Hasil Perhitungan'}}/>
                <StackUser.Screen name="HitungCepat" component={HitungCepat} options={{headerShown: false}}/>
                <StackUser.Screen name="TambahAnggota" component={TambahAnggota} options={{headerShown: false}}/>
                <StackUser.Screen name="PermohonanAnggota" component={PermohonanAnggota} options={{headerShown: false}}/>
                <StackUser.Screen name="DetailAnggota" component={DetailAnggota} options={{headerShown: true, title: 'Detail Anggota'}}/>
            </StackUser.Navigator>
        );
    }
  }

export class AuthStack extends Component {
    render(){
        return (
            <Auth.Navigator screenOptions={{headerTitleAlign: 'center'}}>
                <Auth.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
                <Auth.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Auth.Screen name="Hasil" component={Hasil} options={{headerShown: true, title: 'Hasil Perhitungan'}}/>
                <Auth.Screen name="HitungCepat" component={HitungCepat} options={{headerShown: false}}/>
                
            </Auth.Navigator>
        )
    }
}



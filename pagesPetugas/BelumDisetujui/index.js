import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { auth } from '../../config/FIREBASE';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {DevSettings} from 'react-native';

export class BelumDisetujui extends Component {
    constructor(props){
        super(props)
    }

    logOut = async () => {
        await AsyncStorage.clear();
        DevSettings.reload()
    }

    render() {
        const {logout} = this.props
        return(
            <View style={styles.container2}>
                <Image source={require(`../../assets/confirm.png`)} style={styles.noDataImg}></Image>
                <Text style={styles.noDataText1}>Permohonan Belum Disetujui</Text>
                <Text style={styles.noDataText2}>Permohonanmu anggotamu sudah terkirim,  </Text>
                <Text style={styles.noDataText2}>namun Admin belum menyetujui status keanggotaanmu. </Text>
                <Text style={styles.noDataText2}>Silahkan kembali lagi nanti</Text>
                
                <TouchableOpacity style={styles.tombol} onPress={() => logout()}>
                    <Text style={styles.textTombol}>Kembali ke Halaman Awal</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataImg: {
        width: 200,
        height: 200
    },
    noDataText1: {
        color: '#5669ff',
        fontFamily: 'Poppins-Bold',
        fontSize: 25,
    },
    noDataText2: {
        color: '#444',
        fontFamily: 'Poppins-Reg',
        fontSize: 13,
    },
    tombol: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 7,
        backgroundColor: '#5669ff',
        marginTop: 40,
    },
    textTombol: {
        fontFamily: 'Poppins-Bold',
        color: '#fff'
    }
})

export default BelumDisetujui
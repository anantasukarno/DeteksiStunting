import { Text, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faCircleCheck, faUser} from '@fortawesome/free-solid-svg-icons'

export class Info extends Component {
  render() {
    return (
      <View style={styles.container}>
            <Text style={styles.judul}>INFO APLIKASI</Text>
            <Text style={styles.judul2}>Metode Perhitungan Stunting</Text>
            <FontAwesomeIcon icon={ faCircleCheck } style={styles.icon} size={30}/>
            <Text style={styles.paragraf}>Aplikasi ini menggunakan dua perhitungan yaitu perhitungan Z-Score dan K-Nearest Neighbor (K-NN). Perhitungan Z-Score menerima inputan usia dan tinggi badan anak kemudian dimasukkan dalam rumus yang telah ditetapkan oleh Kementerian Kesehatan. Jika hasil perhitungan berada di bawah -2 Standar Deviasi yang telah ditentukan, maka anak dikategorikan stunting. Sedangkan untuk perhitungan K-NN, sistem menerima beberapa inputan seperti tinggi badan lahir, tinggi badan dan berat badan kemudian data yang diterima dibandingkan dengan data-data yang tersimpan dalam database lalu dikategorikan berdasarkan data yang paling mirip dengan data yang diinputkan.</Text>
            <Text style={styles.judul2}>Pembuat Aplikasi</Text>
            <FontAwesomeIcon icon={ faUser } style={styles.icon} size={30}/>
            <Text style={styles.paragraf2}>Ananta Sukarno</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    judul: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#5669ff',
        textAlign: 'center'
    },
    judul2: {
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
        color: '#5669ff',
        marginTop: 20,
    },
    paragraf: {
        textAlign: 'justify'
    },
    paragraf2: {
        textAlign: 'center'
    },
    icon: {
        color: '#5669ff',
        marginVertical: 10,
        alignSelf: 'center'
    }
})

export default Info
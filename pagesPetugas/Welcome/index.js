import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, StatusBar, TouchableOpacity  } from 'react-native';

export class Welcome extends Component {
    constructor(props){
        super(props);

    }
    render() {
        return (
        <View style={styles.container}>
            <StatusBar />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Kenali</Text>
                    <Text style={styles.headerTitle2}>Stunting!</Text>
                    <Text style={styles.headerParagraf}>Ayo kenali stunting dan cara pencegahannya untuk memperbaiki kualitas anak-anak sebagai penerus bangsa yang hebat!</Text>
                </View>
                <Image source={require('../../assets/welcome.png')} style={styles.headerImage}></Image>
            </View>
            <View style={styles.body}>
                <View style={styles.bodyWrapperButton}>
                    <TouchableOpacity style={styles.bodyButton} onPress={() => this.props.navigation.navigate('Kenali')}>
                        <Image source={require('../../assets/kenali.png')} style={styles.bodyIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.bodyText}>Kenali</Text>
                </View>
                <View style={styles.bodyWrapperButton}>
                    <TouchableOpacity style={styles.bodyButton} onPress={() => this.props.navigation.navigate('HitungCepat')}>
                        <Image source={require('../../assets/hitung.png')} style={styles.bodyIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.bodyText}>Hitung Cepat</Text>
                    <Text style={styles.bodyText2}>metode Z-Score</Text>
                </View>
                <View style={styles.bodyWrapperButton}>
                    <TouchableOpacity style={styles.bodyButton} onPress={() => this.props.navigation.navigate('Kuisioner')}>
                        <Image source={require('../../assets/hitung.png')} style={styles.bodyIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.bodyText}>Hitung Cepat</Text>
                    <Text style={styles.bodyText2}>metode K-NN</Text>
                </View>
                <View style={styles.bodyWrapperButton}>
                    <TouchableOpacity style={styles.bodyButton} onPress={() => this.props.navigation.navigate('Persebaran')}>
                        <Image source={require('../../assets/tips.png')} style={styles.bodyIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.bodyText}>Persebaran</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={()=> this.props.navigation.navigate('Login')}>
                    <Text style={styles.footerButtonText}>Gabung Bersama Kami</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    }
}

const width =  Dimensions.get('window').width;
const height =  Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
        width: width,
        height: 2/3 * height,
        backgroundColor: '#5669ff',
        borderBottomEndRadius: width/10,
        borderBottomStartRadius: width/10,
        justifyContent: 'space-between',
        paddingHorizontal: 25
    },
    headerImage: {
        width: 230,
        height: 350,
        alignSelf: 'center'
    },
    headerTitle: {
        fontSize: 40,
        color: '#fff',
        marginTop: 20,
        fontFamily: 'Poppins-Bold',
    },
    headerTitle2: {
        fontSize: 40,
        color: '#fff',
        marginTop: -10,
        fontFamily: 'Poppins-Bold',
    },
    headerParagraf: {
        color: '#fff',
        width: 2.5/3 * width,
        fontSize: 15,
        fontFamily: 'Poppins-Reg'
    },
    body: {
        marginTop: 40,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bodyWrapperButton: {
        alignItems: 'center',
        
    },
    bodyButton: {
        width: width/4 - 50,
        height: width/4 - 50,
        backgroundColor: '#5669ff',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    bodyIcon: {
        width: '50%',
        height: '50%'
    },
    bodyText: {
        fontSize: 12,
        marginTop: 5,
        color: '#444',
        fontFamily: 'Poppins-Bold',
    },
    bodyText2: {
        fontSize: 11,
        marginTop: -5,
        color: '#444',
        fontFamily: 'Poppins-Bold',
    },
    footer: {
        paddingHorizontal: 25,
        marginTop: 30,
    },
    footerButton: {
        backgroundColor: '#5669ff',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
    },
    footerButtonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 13,
        color: '#fff',
    }
  });

export default Welcome;


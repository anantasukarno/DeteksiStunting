import { Text, View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { auth } from '../../config/FIREBASE';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DevSettings} from 'react-native';
import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faInfo, faUser, faUsers, faUserPlus, faUserCheck, faUserEdit, faUserGear, faUserTie, faLightbulb, faQuestionCircle, faCalculator, faSignOut, faGlobe} from '@fortawesome/free-solid-svg-icons'


export class HomeAnggota extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataUser: {},
            jumlahPermohonan: 0,
            periksaPermohonan: {},
            wilayah: '',
            idDesa: '',
            kelurahan: '',
            idKecamatan: '',
            kecamatan: '',
            puskesmas: ''
        }
    }

    async componentDidMount(){
        const userId = await AsyncStorage.getItem('idUser')
        this.setState({
            idUser: userId
        })
        const dbRef = ref(getDatabase());
        await get(child(dbRef, `dataAnggota/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            this.setState({
                dataUser: snapshot.val(),
                wilayah: snapshot.val().wilayah,
            })
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });

        this.periksaPermohonan()
        await this.getPetugas()
    }

    periksaPermohonan(){
        const dbRef = ref(getDatabase());
        const db = getDatabase()
        const refAnggota = query(ref(db, "dataAnggota"), orderByChild("status"), equalTo("permohonan"))
        onValue(refAnggota, (snapshot) => {
            this.setState({
                periksaPermohonan: snapshot.val(),
            })
            if(this.state.periksaPermohonan){
            const asArray = Object.entries(this.state.periksaPermohonan);
            const filtered = asArray.filter((item) => {
                return item[1].puskesmas.toLowerCase().includes(this.state.wilayah.toLowerCase())
            });
            const justStrings = Object.fromEntries(filtered);
            this.setState({
                periksaPermohonan: justStrings,
            })
            if(this.state.periksaPermohonan){
                const jumlahPermohonan = Object.keys(this.state.periksaPermohonan).length
                this.setState({
                    jumlahPermohonan: jumlahPermohonan,
                })
            }
            }
          }, {
            onlyOnce: true
        });
    }

     //Mendapatkan identitas petugas
     async getPetugas(){
        const userId = await AsyncStorage.getItem('idUser')
        const dbRef = ref(getDatabase());
        get(child(dbRef, `dataPetugas/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            this.setState({
                wilayah: snapshot.val().wilayah,
            })
            this.getPuskesmas();
            
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
    }
  
  
    async getPuskesmas(){
      const dbRef = ref(getDatabase());
      let wilayah = this.state.wilayah;
  
      const db = getDatabase()
        const refAnggota = query(ref(db, "dataPuskesmas"), orderByChild("nama"), equalTo(wilayah))
          onValue(refAnggota, (snapshot) => {
  
            let data = snapshot.val()
            let key = Object.keys(data)[0]
  
            let namaKecamatan = data[key].nama
              this.setState({
                  idKecamatan: key,
                  kecamatan: namaKecamatan
              })
            }, {
              onlyOnce: true
          });
    }

    render() {
        AsyncStorage.setItem('desa', this.state.kelurahan)
        AsyncStorage.setItem('kecamatan', this.state.kecamatan)
        const {logout} = this.props;
        const {navigation, route} = this.props
        return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerText1}>Hello {this.state.dataUser.nama}</Text>
                    <Text style={styles.headerText2}>Apa yang ingin anda lakukan?</Text>
                </View>
                <TouchableOpacity style={styles.wrapperAvatar} onPress={() => {this.props.navigation.navigate('RiwayatPertumbuhan', {
                    idAnggota: this.state.idUser
                })}}>
                    <Image source={{uri: this.state.dataUser.urlFoto}} style={styles.avatarIcon} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.imageSlider} horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.wrapperGambar}>
                    <Image source={require(`../../assets/img/2.jpeg`)} style={styles.gambar} />
                </View>
                <View style={styles.wrapperGambar}>
                    <Image source={require(`../../assets/img/1.jpeg`)} style={styles.gambar} />
                </View>
                <View style={styles.wrapperGambar}>
                    <Image source={require(`../../assets/img/3.jpg`)} style={styles.gambar} />
                </View>
                <View style={styles.wrapperGambar}>
                    <Image source={require(`../../assets/img/4.jpg`)} style={styles.gambar} />
                </View>
            </ScrollView>
            <View style={styles.body}>
                    <View style={styles.bodyWrapperButton}>
                        <TouchableOpacity style={styles.bodyButton} onPress={()=> this.props.navigation.navigate('TentangStunting')}>
                            <FontAwesomeIcon icon={ faQuestionCircle } style={styles.bodyIcon} size={25}/>
                            <Text style={styles.bodyText}>Tentang Stunting</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyWrapperButton}>
                        <TouchableOpacity style={styles.bodyButton} onPress={()=> this.props.navigation.navigate('Kuisioner')}>
                        <FontAwesomeIcon icon={ faCalculator } style={styles.bodyIcon} size={25}/>
                            <Text style={styles.bodyText}>Hitung Cepat</Text>
                            <Text style={styles.bodyText2}>Metode K-NN</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyWrapperButton}>
                        <TouchableOpacity style={styles.bodyButton} onPress={()=> this.props.navigation.navigate('HitungCepat')}>
                        <FontAwesomeIcon icon={ faCalculator } style={styles.bodyIcon} size={25}/>
                            <Text style={styles.bodyText}>Hitung Cepat</Text>
                            <Text style={styles.bodyText2}>Metode Z-Score</Text>
                        </TouchableOpacity>
                    </View>
            </View>
            <View style={styles.body}>
                    <View style={styles.bodyWrapperButton}>
                        <TouchableOpacity style={styles.bodyButton} onPress={()=> this.props.navigation.navigate('PersebaranStunting')}>
                        <FontAwesomeIcon icon={ faGlobe } style={styles.bodyIcon} size={25}/>
                            <Text style={styles.bodyText}>Persebaran Stunting</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyWrapperButton}>
                        <TouchableOpacity style={styles.bodyButton} onPress={()=> this.props.navigation.navigate('Info')}>
                        <FontAwesomeIcon icon={ faLightbulb } style={styles.bodyIcon} size={25}/>
                            <Text style={styles.bodyText}>Info Aplikasi</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyWrapperButtonLogout}>
                        <TouchableOpacity style={styles.bodyButtonLogout} onPress={() => logout()}>
                        <FontAwesomeIcon icon={ faSignOut } style={styles.bodyIconLogout}  size={25}/>
                            <Text style={styles.bodyTextLogout}>Logout</Text> 
                        </TouchableOpacity>
                    </View>
            </View>
            
        </View>
        )
    }
}

const width =  Dimensions.get('window').width - 20;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f3f3',
        paddingBottom: 500,
    },
    header: {
        marginTop: 40,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText1: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#5669ff',
    },
    headerText2: {
        fontFamily: 'Poppins-Reg',
        color: '#999',
        fontSize: 13
    },
    imageSlider: {
        paddingHorizontal: 20,
        marginTop: 40,
    },
    wrapperGambar: {
        width: width - 60,
        height: 9/16 * width,
        marginRight: 20,
        overflow: 'hidden',
        borderRadius: 7
    },
    gambar: {
        width: '100%',
        height: '100%',
    },
    body: {
        marginTop: 40,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bodyWrapperButton: {
        alignItems: 'center',
        
    },
    bodyButton: {
        width: width/3 - 30,
        height: width/3 - 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#999",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.13,
        shadowRadius: 2.62,
        elevation: 4,
        padding: 20, 
    },
    bodyIcon: {
        color: '#5669ff'
    },
    bodyWrapperButtonLogout: {
        alignItems: 'center',
        
    },
    bodyButtonLogout: {
        width: width/3 - 30,
        height: width/3 - 30,
        backgroundColor: '#5669ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#5669ff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.13,
        shadowRadius: 2.62,
        elevation: 4,
        padding: 20, 
    },
    bodyIconLogout: {
        color: '#fff'
    },
    bodyText: {
        fontSize: 10,
        marginTop: 10,
        color: '#999',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    bodyText2: {
        fontSize: 8,
        marginTop: 0,
        color: '#999',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    bodyTextLogout: {
        fontSize: 10,
        marginTop: 10,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    avatarIcon: {
        width: 35,
        height: 35,
    },
    wrapperAvatar: {
        backgroundColor: '#5669ff',
        borderRadius: 35/2,
        overflow: 'hidden',
    },
    notif: {
        width: 30,
        height: 30,
        backgroundColor: '#edc124',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -12,
        right: -12,
        elevation: 5,
    },
    tombolLogout: {
        paddingVertical: 12,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 7,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default HomeAnggota
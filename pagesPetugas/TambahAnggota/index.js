import { Text, View, StyleSheet, TextInput, TouchableOpacity, Picker, Alert, Image, ScrollView } from 'react-native'
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getDatabase, ref, child, get, remove, query, orderByChild, equalTo, onValue, update, set } from "firebase/database";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from "expo-image-picker";
import { Base64 } from 'js-base64';
import {getStorage, ref as sRef, put, uploadBytes, getDownloadURL} from 'firebase/storage'



export class TambahAnggota extends Component {
  constructor(props){
    super(props);
    this.state = {
      idUser: '',
      email: '',
      password: '',
      level: '',
      status: '',
      nama: '',
      nik: '',
      jenisKelamin: '',
      tempatLahir: '',
      tanggalLahir: '',
      kelurahan: '',
      kecamatan: '',
      hidePassword: true,
      data: [],
      key: '',
      tanggalLahirMentah: new Date(),
      showTanggalLahir: false,
      modeTanggal: 'date',
      foto: 'https://firebasestorage.googleapis.com/v0/b/stunt-5913f.appspot.com/o/fotoAnggota%2Fuser.png?alt=media&token=b162b3d4-3e41-4895-8922-6577ed6b4b9c',
      urlFoto: '',
      isUser: true,
      isEmail: true,
      dataKecamatan: {},
      dataDesa: {},
      wilayah: '',
      idKecamatan: '',
      idDesa: ''
    }

  }
  
  async componentDidMount(){
    await this.getPetugas();
    this.getKecamatan();
    this.getDesa(); 
  }

  //Mendapatkan identitas petugas
    async getPetugas(){
      const userId = await AsyncStorage.getItem('idUser')
      const dbRef = ref(getDatabase());
      get(child(dbRef, `dataPetugas/${userId}`)).then(async (snapshot) => {
      if (snapshot.exists()) {
          await this.setState({
              wilayah: snapshot.val().wilayah,
          })
          console.log(this.state.wilayah)
          await this.getKecamatan()
          this.getDesa() 
      } else {
          console.log("No data available");
      }
      }).catch((error) => {
      console.error(error);
      });
  }

  async getKecamatan(){
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `dataPuskesmas/${this.state.wilayah}/distrik`)).then((snapshot) => {
      if (snapshot.exists()) {
        let kecamatan = Object.keys(snapshot.val())
        this.setState({
          dataKecamatan: snapshot.val(),
          kecamatan: kecamatan[0]
        })
      } else {
        console.log("Kecamatan Tidak ada");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  async getDesa(){
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `dataPuskesmas/${this.state.wilayah}/distrik/${this.state.kecamatan}/kampung`)).then((snapshot) => {
      console.log(snapshot.val())
      if (snapshot.exists()) {
        this.setState({
          dataDesa: snapshot.val(),
        })

      } else {
        console.log("No data Desa available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  async onLogin(){
    if (!this.state.email || !this.state.password || !this.state.level) {
      Alert.alert('Perhatian', 'Isi formulir dengan benar')
    }
    else{
      await AsyncStorage.setItem('email', this.state.email)
      await AsyncStorage.setItem('password', this.state.password)
    }
  }

  showModeTanggal(){
      this.setState({
          showTanggalLahir: true
      })
  }

  onChangeTanggal = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.tanggalLahirMentah;
    console.log(currentDate)
    let tanggalLahir = JSON.stringify(currentDate)
    tanggalLahir = tanggalLahir.slice(1, 11)
    tanggalLahir = tanggalLahir.split("-")
    const tanggal = tanggalLahir[2]
    const bulan = tanggalLahir[1]
    const tahun = tanggalLahir[0]
    tanggalLahir = tanggal + '/' + bulan + '/' + tahun
    this.setState({
        tanggalLahirMentah: currentDate,
        showTanggalLahir: false,
        tanggalLahir: tanggalLahir
    });
    
    };

    openPicker = async ()=>{
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          this.setState({
              ...this.state,
              foto: result.uri
          })
        }
    }

    async onSubmit(){
      if (!this.state.email || !this.state.password || !this.state.nama || !this.state.nik || !this.state.tempatLahir || !this.state.tanggalLahir || !this.state.jenisKelamin || !this.state.kelurahan || !this.state.kecamatan ) {
        Alert.alert('Gagal', 'Semua Formulir Wajib Diisi')
      }
      else{
      const db = getDatabase()
        const refEmail = query(ref(db, "users"), orderByChild("email"), equalTo(this.state.email))
        onValue(refEmail, async (snapshot) => {
            this.setState({
                isEmail: false,
            })
            if (this.state.isEmail) {
              Alert.alert('Gagal', 'Email telah terpakai')
            }
            else{
              const refAnggota = query(ref(db, "dataAnggota"), orderByChild("nik"), equalTo(this.state.nik))
              onValue(refAnggota, async (snapshot) => {
                  this.setState({
                      isUser: false,
                  })
                  if (this.state.isUser) {
                    Alert.alert('Gagal', 'NIK sudah terpakai')
                  }
                  else{
                  const tanggal = Date.now()
                  let idUser = this.state.nama.split(" ")
                  idUser = idUser[0] + tanggal
            
                  let passEnc = Base64.encode(this.state.password);
                  
            
                  if (this.state.foto == 'https://firebasestorage.googleapis.com/v0/b/stunt-5913f.appspot.com/o/fotoAnggota%2Fuser.png?alt=media&token=b162b3d4-3e41-4895-8922-6577ed6b4b9c') {
                    this.setState({
                      urlFoto: this.state.foto
                    })
                  }
                  else{
                    const response = await fetch(this.state.foto);
                    const blob = await response.blob();
            
                    const storage = getStorage();
                    const fotoAnggota = sRef(storage, "fotoAnggota/"+ this.state.nik + ".jpg")
                            
                    await uploadBytes(fotoAnggota, blob).then((snapshot) => {
                      console.log('sukses')
                    })
            
                    await getDownloadURL(fotoAnggota).then((url) => {
                      this.setState({
                        ...this.state,
                        urlFoto: url
                      })
                    })
                  }
                    await set(ref(db, 'dataAnggota/' + idUser), {
                      idAnggota: idUser,
                      nama: this.state.nama,
                      email: this.state.email,
                      level: 'anggota',
                      status: 'disetujui',
                      nik: this.state.nik,
                      jenisKelamin: this.state.jenisKelamin,
                      tempatLahir: this.state.tempatLahir,
                      tanggalLahir: this.state.tanggalLahir,
                      alamat: {
                        distrik: this.state.kecamatan,
                        kampung: this.state.kelurahan
                      },
                      puskesmas: this.state.wilayah,
                      urlFoto: this.state.urlFoto,
                      kondisi: 'Normal',
                      
                    });
                    await set(ref(db, 'users/' + idUser), {
                      id: idUser,
                      email: this.state.email,
                      level: 'anggota',
                      status: 'disetujui',
                      password: passEnc
                    });
                    Alert.alert('Sukses', 'Anggota Berhasil Ditambahkan')
                    this.props.navigation.replace('DaftarAnggota')  
                  }
                }, {
                  onlyOnce: true
              });
              
            }
          }, {
            onlyOnce: true
        });
      
      }
    }

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container} >
      <Text style={styles.judul}>Tambah Anggota</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.textInput}
          value={this.state.email}
          onChangeText={(text) => this.setState({email: text})}
          placeholder="Email"
        ></TextInput>
        <Text style={styles.label}>Password</Text>
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
        <Text style={styles.label}>Nama</Text>
        <TextInput 
          style={styles.textInput}
          value={this.state.nama}
          onChangeText={(text) => this.setState({nama: text})}
          placeholder="Nama"
        ></TextInput>
        <Text style={styles.label}>NIK</Text>
        <TextInput 
          style={styles.textInput}
          value={this.state.nik}
          onChangeText={(text) => this.setState({nik: text})}
          placeholder="NIK"
        ></TextInput>
        <Text style={styles.label}>Tempat Lahir</Text>
        <TextInput 
          style={styles.textInput}
          value={this.state.tempatLahir}
          onChangeText={(text) => this.setState({tempatLahir: text})}
          placeholder="Tempat Lahir"
        ></TextInput>
        <Text style={styles.label}>Tanggal Lahir</Text>
        <View style={styles.wrapperTwoColumn}>
            <TextInput 
            style={styles.textInput}
            editable={false}
            placeholder="Tanggal Lahir"
            value={this.state.tanggalLahir}
            ></TextInput>
            <TouchableOpacity style={styles.tombolTanggal} onPress={() => this.showModeTanggal()}>
                <Text style={styles.textTombolTanggal}>Pilih Tanggal</Text>
            </TouchableOpacity>
        </View>
        
        {this.state.showTanggalLahir && (<DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.tanggalLahirMentah}
                    mode={this.state.modeTanggal}
                    is24Hour={true}
                    display="default"
                    onChange={this.onChangeTanggal}
                    />
                )}

        <Text style={styles.label}>Jenis Kelamin</Text>
        <View style={styles.picker}>
                <Picker
                    selectedValue={this.state.level}
                    onValueChange={(itemValue, itemIndex) => this.setState({...this.state, jenisKelamin: itemValue})}
                    style={styles.pickerChild}
                >
                    <Picker.Item label="Pilih jenis kelamin" value="0" />
                    <Picker.Item label="Laki-laki" value="Laki-laki" />
                    <Picker.Item label="Perempuan" value="Perempuan" />
                </Picker>
        </View>
        
        <Text style={styles.label}>Puskesmas</Text>
        <TextInput 
          style={styles.textInput}
          value={this.state.wilayah}
          onChangeText={(text) => this.setState({kecamatan: text})}
          placeholder="Distrik/Kecamatan"
          editable={false}
        ></TextInput>

        <Text style={styles.text1}>Alamat</Text>
        <Text style={styles.label}>Distrik/Kecamatan</Text>
        
        <View style={styles.picker}>
            <Picker
              selectedValue={this.state.kecamatan}
              onValueChange={async  (itemValue, itemIndex) => {
                await this.setState({...this.state, kecamatan: itemValue})
                this.getDesa()
              }}
              style={styles.pickerChild}  
              >
                {
                  Object.keys(this.state.dataKecamatan).map(function(key, index) {
                    let ident = key.split('_')
                    let label = ident.join(' ')
                    let value = ident[1]
                    return(
                      <Picker.Item label={label} value={key} />
                    )
                  })
                  
                }
              </Picker>
        </View>
        <Text style={styles.label}>Desa</Text>
       
        <View style={styles.picker}>
            <Picker
              selectedValue={this.state.kelurahan}
              onValueChange={(itemValue, itemIndex) => this.setState({...this.state, kelurahan: itemValue})}
              style={styles.pickerChild}  
              >
                {
                  Object.keys(this.state.dataDesa).map(function(key, index) {
                    let ident = key.split('_')
                    let label = ident.join(' ')
                    let value = ident[1]
                    return(
                      <Picker.Item label={label} value={key} />
                    )
                  })
                  
                }
              </Picker>
        </View>
        <Image source={{uri: this.state.foto}} style={styles.foto} />
        <TouchableOpacity style={styles.tombolFoto} onPress={()=> this.openPicker()}>
                <Text style={styles.textTombolTanggal}>Pilih Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tombolLogin} onPress={()=>{ this.onSubmit()}}>
          <Text style={styles.textTombolLogin}>Tambah</Text>
        </TouchableOpacity>
       
      </View>
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 50
  },
  judul: {
    color: '#333',
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    marginTop: 30,
    marginBottom: 10,
  },
  text1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#444',
    marginLeft: 5,
    marginBottom: -5,
    marginTop: 10,
  },
  textInput: {
    minWidth: '60%',
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
    marginLeft: 5,
  },
  text2: {
    fontFamily: 'Poppins-Reg',
    color: '#999',
    marginTop: 5
  },
  text3: {
    fontFamily: 'Poppins-Reg',
    color: '#5669ff',
    marginTop: 5
  },
  label: {
      fontFamily: 'Poppins-Reg',
      marginLeft: 5,
      marginBottom: -5,
      marginTop: 10,
      fontSize: 13,
      color: '#444'
  },
  tombolTanggal: {
      flex: 1,
      backgroundColor: '#b2e2f7',
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 13,
      borderRadius: 7,
      marginLeft: 10,
  },
  textTombolTanggal: {
      fontFamily: 'Poppins-Bold',
      color: '#fff'
  },
  wrapperTwoColumn: {
      flexDirection: 'row'
  },
  tombolFoto: {
    backgroundColor: '#b2e2f7',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 20,
  },
  foto: {
    width: 100,
    borderRadius: 50,
    height: 100,
    alignSelf: 'center',
    marginTop: 10,
  }
})

export default TambahAnggota
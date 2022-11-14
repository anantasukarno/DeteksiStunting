import { Text, View, StyleSheet, Image, FlatList, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { Component } from 'react'
import { getDatabase, ref, child, get, update, remove, query, orderByChild, equalTo, onValue } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faX, faEye, faLocationDot } from '@fortawesome/free-solid-svg-icons'


export class DetailAdmin extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {},
      tanggalLahir: '',
      idKecamatan: '',
      kecamatan: '',
      idDesa: '',
      kelurahan: '',
      wilayah: '',
      isLoad: true,
    }
  }

  async componentDidMount(){
    await this.getData();
    this.setState({
      isLoad: false
    })
  }

  async getData(){
    const {navigation,route}=this.props;
    const { idAdmin } = route.params;
    const dbRef = ref(getDatabase());
    console.log(idAdmin)
    await get(child(dbRef, `dataAdmin/${idAdmin}`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        this.setState({
          data: snapshot.val(),
          wilayah: snapshot.val().wilayah,
          idAdmin: idAdmin
        })
        // this.getKecamatan();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    let tanggalLahir = await this.state.data.tanggalLahir;
    const pecah = await tanggalLahir.split("/"); 
    const bulan = await pecah[1];
    const bulanHuruf = this.toMoon(bulan)
    tanggalLahir = pecah[0] + ' ' + bulanHuruf + ' ' + pecah[2]


    this.setState({
      ...this.state,
      tanggalLahir: tanggalLahir
    })
  }

  toMoon(number){
    let nameMoon;
    switch (number) {
      case '01':
        nameMoon = 'Januari'
        break;
    
      case '02':
        nameMoon = 'Februari'
        break;
    
      case '03':
        nameMoon = 'Maret'
        break;
    
      case '04':
        nameMoon = 'April'
        break;
    
      case '05':
        nameMoon = 'Mei'
        break;
    
      case '06':
        nameMoon = 'Juni'
        break;
    
      case '07':
        nameMoon = 'Juli'
        break;
    
      case '08':
        nameMoon = 'Agustus'
        break;
    
      case '09':
        nameMoon = 'September'
        break;
    
      case '10':
        nameMoon = 'Oktober'
        break;
    
      case '11':
        nameMoon = 'November'
        break;
    
      case '12':
        nameMoon = 'Desember'
        break;
    
      default:
        nameMoon = 'VA'
        break;
    }

    return nameMoon
  }

  onHapus(id){
    const dbRef = ref(getDatabase());
        remove(child(dbRef, `users/${id}`))
        remove(child(dbRef, `dataAdmin/${id}`))
        .then(() => {
            Alert.alert('Sukses', 'Admin Berhasil Dihapus');
            this.props.navigation.replace('DaftarAdmin')
        })
        .catch(() => {
            Alert.alert('Gagal', 'Data Gagal Dihapus');
            this.props.navigation.replace('DaftarAdmin')
    })
  }

  
  render() {
    console.log(this.state.idPetugas)
    if(this.state.isLoad){
      return(
        <Text>Loading</Text>
      )
    }
    else{
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image source={{uri: this.state.data.urlFoto}} style={styles.imgItem}/>
        <View style={styles.body}>
          <Text style={styles.nama}>{this.state.data.nama}</Text>
          <Text style={styles.nik}>NIK. {this.state.data.nik}</Text>
        <View style={styles.kotakBiodata}>
          <View style={styles.itemBiodata}>
            <Text style={styles.biodataQuestion}>Jenis Kelamin</Text>
            <Text style={styles.biodataAnswer}>{this.state.data.jenisKelamin}</Text>
          </View>
          <View style={styles.itemBiodata}>
            <Text style={styles.biodataQuestion}>Tempat Lahir</Text>
            <Text style={styles.biodataAnswer}>{this.state.data.tempatLahir}</Text>
          </View>
          <View style={styles.itemBiodata}>
            <Text style={styles.biodataQuestion}>Tanggal Lahir</Text>
            <Text style={styles.biodataAnswer}>{this.state.tanggalLahir}</Text>
          </View>
        </View>
        <View style={styles.wrapperTombol}>
          <View style={styles.tombolCol1}>
            <TouchableOpacity style={styles.tombolSecondary} onPress={() => this.props.navigation.navigate('UbahAdmin', {
              idAnggota: this.state.data.id
            })}>
              <Text style={styles.textTombolSecondary}>Ubah Profile</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.tombolTersier} onPress={() => Alert.alert('Hapus Anggota', 'Yakin ingin menghapus anggota?', [{
                                text: 'Tidak',
                                onPress: () => console.log('Tidak Menghapus')
                            },
                            {
                                text: 'Hapus',
                                onPress: () => this.onHapus(this.state.idAdmin)
                            }
                            ]) }>
            <Text style={styles.textTombolTersier}>Hapus</Text>
          </TouchableOpacity>
        </View>
        </View>
        <>
        </>
      </View>
                
      </ScrollView>
    )
  }     
}
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    minHeight: height,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imgItem: {
    width: width,
    height: width,
  },
  body: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: -20
  },
  nama: {
    fontFamily: 'Poppins-Bold',
    fontSize: 30,
    marginTop: 0,
    color: '#444'
  },
  nik: {
    fontFamily: 'Poppins-Reg',
    fontSize: 15,
    color: '#888'
  },
  kotakBiodata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  biodataQuestion: {
    fontFamily: 'Poppins-Reg',
    fontSize: 14,
    color: '#888'
  },
  biodataAnswer: {
    fontFamily: 'Poppins-Bold',
    color: '#444'
  },
  head: {
    fontFamily: 'Poppins-Bold',
    color: '#5669ff',
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginTop: 50,
  },
  wilayah: {
    flexDirection: 'row',
    marginTop: 10,
  },
  icon: {
    marginRight: 5,
  },
  tombolTambah: {
    width: 60,
    height: 60,
    borderRadius: 60/2,
    backgroundColor: '#5669ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    right: 40,
},
textTombolTambah: {
    color: '#fff',
    fontSize: 40,
},
tombolPrimary: {
  backgroundColor: '#5669ff',
  paddingHorizontal: 20,
  paddingTop: 10,
  paddingBottom: 7,
  borderRadius: 15,
  flexDirection: 'row'
},
textTombolPrimary: {
  fontFamily: 'Poppins-Bold',
  color: '#fff',
  marginLeft: 7,
},
tombolSecondary: {
  borderWidth: 2,
  borderRadius: 15,
  borderColor: '#5669ff',
  paddingHorizontal: 20,
  paddingTop: 10,
  paddingBottom: 7,
  marginRight: 7,
},
textTombolSecondary: {
  fontFamily: 'Poppins-Bold',
  color: '#5669ff'
},
textTombolTersier: {
  fontFamily: 'Poppins-Bold',
  color: '#999',
  marginTop: 10,
  marginLeft: 5,
},
wrapperTombol: {
  width: '100%',
  marginTop: 40,
  marginBottom: 20,
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
  
},
})

export default DetailAdmin
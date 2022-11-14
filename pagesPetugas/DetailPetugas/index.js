import { Text, View, StyleSheet, Image, FlatList, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { Component } from 'react'
import { getDatabase, ref, child, get, update, remove, query, orderByChild, equalTo, onValue } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faX, faEye, faLocationDot } from '@fortawesome/free-solid-svg-icons'


export class DetailPetugas extends Component {
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
    const { idPetugas } = route.params;
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `dataPetugas/${idPetugas}`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.setState({
          data: snapshot.val(),
          wilayah: snapshot.val().wilayah
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

  // async getDesa(){
  //   const dbRef = ref(getDatabase());
  //   const idKecamatan = this.state.idKecamatan;
  //   let wilayah = await this.state.wilayah;
  //   get(child(dbRef, `dataPuskesmas/${idKecamatan}/desa/${wilayah}`)).then((snapshot) => {
  //     console.log(snapshot.val())
  //     if (snapshot.exists()) {
  //         this.setState({
  //             idDesa: wilayah,
  //             kelurahan: snapshot.val().nama,
  //         })
  //     } else {
  //         console.log("No data available");
  //     }
  //     }).catch((error) => {
  //     console.error(error);
  //     });
  // }

  // async getKecamatan(){
  //   const dbRef = ref(getDatabase());
  //   let wilayah = await this.state.wilayah;
  //   wilayah = await this.state.wilayah.split('@');
  //   wilayah = await wilayah[1];
  //   wilayah = await wilayah.substring(0, 7)

  //   console.log(wilayah)
  //   const db = getDatabase()
  //    const refAnggota = query(ref(db, "dataWilayah"), orderByChild("idKecamatan"), equalTo(wilayah))
  //       onValue(refAnggota, (snapshot) => {

  //         let data = snapshot.val()
  //         let key = Object.keys(data)[0]

  //         let namaKecamatan = data[key].nama
  //           this.setState({
  //               idKecamatan: key,
  //               kecamatan: namaKecamatan
  //           })
  //           this.getDesa()
  //         }, {
  //           onlyOnce: true
  //       });
  // }

  
  render() {
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
          <View style={styles.wilayah}>
            <FontAwesomeIcon icon={ faLocationDot } size={15} style={styles.icon}/>
            <Text style={styles.biodataQuestion}>Wilayah Tugas: </Text>
            <Text  style={styles.biodataAnswer}>{this.state.data.wilayah}</Text>
          </View>
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
  }
})

export default DetailPetugas
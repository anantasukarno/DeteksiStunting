import { Text, View, StyleSheet, Image, FlatList, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { Component } from 'react'
import { getDatabase, ref, child, get, update, remove } from "firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faX, faEye } from '@fortawesome/free-solid-svg-icons'
import {
  LineChart,
} from "react-native-chart-kit";


export class DetailAnggota extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {},
      tanggalLahir: '',
      dataPertumbuhan: {},
      tanggalPerbarui: '',
      label: [],
      dataTinggi: [],
      dataBerat: [],
      loadComplete: false,
    }
  }

  componentDidMount(){
    this.getData();
    this.getDataPertumbuhan()
  }

  async getData(){
    const {navigation,route}=this.props;
    const { idAnggota } = route.params;
    
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `dataAnggota/${idAnggota}`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.setState({
          data: snapshot.val(),
        })
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

  async getDataPertumbuhan(){
    const {navigation,route}=this.props;
    const { idAnggota } = route.params;
    
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `dataAnggota/${idAnggota}/pertumbuhan`)).then((snapshot) => {
      if (snapshot.exists()) {
        this.setState({
          dataPertumbuhan: snapshot.val()
        })
        var usia = Object.keys(this.state.dataPertumbuhan).map((key) => this.state.dataPertumbuhan[key].usia + ' Bulan');
        var tinggi = Object.keys(this.state.dataPertumbuhan).map((key) => parseInt(this.state.dataPertumbuhan[key].tinggi));
        var berat = Object.keys(this.state.dataPertumbuhan).map((key) => this.state.dataPertumbuhan[key].berat);
        this.setState({
          label: usia,
          dataTinggi: tinggi,
          dataBerat: berat,
        })
        if(this.state.dataTinggi != null){
          this.setState({
            loadComplete: true
          })
        }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    
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

  onSetujui(id){
    const postData = {
      status: 'disetujui'
    }
    const dbRef = ref(getDatabase());
    const updates = {};
    updates['/dataAnggota/' + id + '/status'] = 'disetujui';
    update(dbRef, updates);
    updates['/dataAnggota/' + id + '/level'] = 'anggota';
    update(dbRef, updates);
    Alert.alert('Sukses', 'Anggota Berhasil disetujui');
    this.props.navigation.replace('PermohonanAnggota')
  }

  onTolak(id){
    const dbRef = ref(getDatabase());
    remove(child(dbRef, `dataAnggota/${id}`))
    .then(() => {
        Alert.alert('Sukses', 'Data Berhasil Dihapus');
        this.props.navigation.replace('PermohonanAnggota')
    })
    .catch(() => {
        Alert.alert('Gagal', 'Data Gagal Dihapus');
        this.props.navigation.replace('DaftarBuku')
    })
}
  onHapus(id){
    const dbRef = ref(getDatabase());
        remove(child(dbRef, `users/${id}`))
        remove(child(dbRef, `dataAnggota/${id}`))
        .then(() => {
            Alert.alert('Sukses', 'Anggota Berhasil Dihapus');
            this.props.navigation.replace('DaftarAnggota')
        })
        .catch(() => {
            Alert.alert('Gagal', 'Data Gagal Dihapus');
            this.props.navigation.replace('DaftarAnggota')
    })
  }


  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image source={{uri: this.state.data.urlFoto}} style={styles.imgItem}/>
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
        {this.state.data.status == 'disetujui' &&
        <>
        <Text style={styles.head}>Riwayat Pertumbuhan Anak</Text>
        <View style={styles.diagram}>
          <Text>Diagram Pertumbuhan</Text>
          {this.state.loadComplete &&
          <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false} // to hide scroll bar
          >
          <LineChart
            data={{
              labels: this.state.label,
              datasets: [
                {
                  data: this.state.dataTinggi
                }
              ]
            }}
            width={this.state.label.length * (Dimensions.get("window").width - 40)  / 5} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=" cm"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `#5669ff`,
              labelColor: (opacity = 1) => `#5669ff`,
              style: {
                borderRadius: 20,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#566900"
              }
            }}
            fromZero={true}
            style={{
              marginVertical: 8,
              borderRadius: 1,
            }}
          />
          </ScrollView>
        }
        </View>
        <FlatList
          data={Object.keys(this.state.dataPertumbuhan)}
          renderItem={({item}) => {
            let tanggalPerbarui = this.state.dataPertumbuhan[item].diperbaruiPada;
            const pecah = tanggalPerbarui.split("/"); 
            const bulan = pecah[1];
            const bulanHuruf = this.toMoon(bulan)
            tanggalPerbarui = pecah[0] + ' ' + bulanHuruf + ' ' + pecah[2]

            return(
              <View style={styles.containerScroll}>
              <View style={styles.wrapperData}>
                <Text style={styles.textDataItem1}>Diperbarui pada</Text>
                <Text style={styles.textDataItem3}>{tanggalPerbarui}</Text>
                <View style={styles.wrapperDataItem}>
                  <View style={styles.dataItem}>
                    <Text style={styles.textDataItem1}>Usia</Text>
                    <Text style={styles.textDataItem2}>{this.state.dataPertumbuhan[item].usia} Bulan</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.textDataItem1}>Tinggi Badan</Text>
                    <Text style={styles.textDataItem2}>{this.state.dataPertumbuhan[item].tinggi} cm</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.textDataItem1}>Berat Badan</Text>
                    <Text style={styles.textDataItem2}>{this.state.dataPertumbuhan[item].berat} kg</Text>
                  </View>
                </View>
                <Text style={styles.textDataItem1}>Hasil perhitungan</Text>
                {(this.state.dataPertumbuhan[item].hasil == 'Pendek' || this.state.dataPertumbuhan[item].hasil == 'Sangat Pendek') &&
                  <Text style={styles.textDataItem3Red}>{this.state.dataPertumbuhan[item].hasil}</Text>
                }
                {(this.state.dataPertumbuhan[item].hasil == 'Normal' || this.state.dataPertumbuhan[item].hasil == 'Tinggi') &&
                  <Text style={styles.textDataItem3}>{this.state.dataPertumbuhan[item].hasil}</Text>
                }
              </View>
              </View>
            )
          }}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.wrapperTombol}>
          <View style={styles.tombolCol1}>
            <TouchableOpacity style={styles.tombolPrimary} onPress={() => this.props.navigation.navigate('TambahPertumbuhan', {
              idAnggota: this.state.data.idAnggota,
              nama: this.state.data.nama,
              jenisKelamin: this.state.data.jenisKelamin
            })}>
              <Text style={styles.textTombolPrimary}>Update Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tombolSecondary} onPress={() => this.props.navigation.navigate('UbahAnggota', {
              idAnggota: this.state.data.idAnggota
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
                                onPress: () => this.onHapus(this.state.data.idAnggota)
                            }
                            ]) }>
            <Text style={styles.textTombolTersier}>Hapus</Text>
          </TouchableOpacity>
        </View>
        </>
        }
        {this.state.data.status == 'permohonan' &&
          <View style={styles.wrapperTombol2}>
            <TouchableOpacity style={styles.tombolPrimary2} onPress={() => Alert.alert('Tolak Anggota', 'Yakin ingin menyetujui anggota?', [{
                                text: 'Tidak',
                                onPress: () => console.log('Tidak Menghapus')
                            },
                            {
                                text: 'Setujui',
                                onPress: () => this.onSetujui(this.state.data.idAnggota)
                            }
                            ])}>
                <FontAwesomeIcon icon={ faCheck } color={'white'} />
                <Text style={styles.textTombolPrimary2}>Setujui</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tombolTersier2} onPress={() => Alert.alert('Setujui Anggota', 'Yakin ingin menolak anggota?', [{
                                        text: 'Tidak',
                                        onPress: () => console.log('Tidak Menghapus')
                                    },
                                    {
                                        text: 'Tolak',
                                        onPress: () => this.onTolak(this.state.data.idAnggota)
                                    }
                                    ])}>
                <Text style={styles.textTombolTersier2}>Tolak</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
      </ScrollView>
    )
  }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imgItem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 60,
    marginBottom: 60,
  },
  nama: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginTop: 15,
    color: '#444'
  },
  nik: {
    fontFamily: 'Poppins-Reg',
    fontSize: 15,
    color: '#888'
  },
  kotakBiodata: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: "#999",
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.13,
    shadowRadius: 2.62,
    elevation: 3,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  biodataQuestion: {
    fontFamily: 'Poppins-Reg',
    fontSize: 14
  },
  biodataAnswer: {
    fontFamily: 'Poppins-Bold'
  },
  head: {
    fontFamily: 'Poppins-Bold',
    color: '#5669ff',
    fontSize: 20,
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginTop: 50,
  },
  containerScroll: {
    paddingVertical: 5,
    width: '100%'
  },
  diagram: {
    height: 250
  },
  wrapperData: {
    width: width - 40,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    shadowColor: "#999",
    shadowOffset: {
      width: 0,
      height: 2,
      },
    shadowOpacity: 0.13,
    shadowRadius: 2.62,
    elevation: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 7,
  },
  wrapperDataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  textDataItem1: {
    fontFamily: 'Poppins-Reg',
  },
  textDataItem2: {
    fontFamily: 'Poppins-Bold'
  },
  textDataItem3: {
    fontFamily: 'Poppins-Bold',
    color: '#5669ff'
  },
  textDataItem3Red: {
    fontFamily: 'Poppins-Bold',
    color: '#dd3333'
  },
  wrapperTombol: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    
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
  tombolCol1: {
    width: '50%',
    flexDirection: 'row-reverse'
  },
  wrapperTombol2: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 40,
  },
  tombolPrimary2: {
    backgroundColor: '#5669ff',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tombolTersier2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
  textTombolPrimary2: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginLeft: 7,
  },
  textTombolTersier2: {
    fontFamily: 'Poppins-Bold',
    color: '#999',
    marginTop: 10,
    marginLeft: 5,
  },
})

export default DetailAnggota